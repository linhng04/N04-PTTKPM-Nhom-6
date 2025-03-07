from fastapi import FastAPI, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from database import create_tables, insert_user, get_user, verify_password, insert_event, get_events_by_user, delete_event, update_event

create_tables()

app = FastAPI()
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Tạo JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

@app.post("/register")
async def register_user(
    username: str = Form(...), 
    email: str = Form(...), 
    password: str = Form(...), 
    confirm_password: str = Form(...)
):
    if password.strip() != confirm_password.strip():
        return JSONResponse(content={"status": "failure", "message": "Passwords do not match"}, status_code=400)
    
    if insert_user(username, email, password):
        return RedirectResponse(url="/", status_code=303)
    
    return JSONResponse(content={"status": "failure", "message": "Username already exists"}, status_code=400)

@app.post("/login")
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)

    if not user:
        return JSONResponse(content={"status": "failure", "message": "User not found"}, status_code=400)

    if not verify_password(form_data.password, user["password"]):
        return JSONResponse(content={"status": "failure", "message": "Incorrect password"}, status_code=400)
    
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=timedelta(minutes=30))
    print("User data:", dict(user))
    return JSONResponse(content={"status": "success", "access_token": access_token, "user_id": user["id"]}, status_code=200)
@app.post("/api/events")
async def add_event(
    user_id: int = Form(...),
    event_name: str = Form(...),
    event_date: str = Form(...),
    event_start: str = Form(...),
    event_end: str = Form(...),
    color: str = Form("blue"),
    completed: bool = Form(False),
    event_notes: str = Form(""),
    token: str = Depends(oauth2_scheme)
):
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    insert_event(user_id, event_name, event_date, event_start, event_end, color, completed, event_notes)
    return JSONResponse(content={"status": "success"}, status_code=201)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub") 
    except JWTError:
        return None

@app.get("/api/events/{user_id}")
async def get_events(user_id: int, token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = get_user(username)
    if not user or user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    events = get_events_by_user(user_id)
    return JSONResponse(content=events, status_code=200)
@app.put("/api/events/update/{event_id}")
async def edit_event(
    event_id: int,
    event_name: str = Form(...),
    event_date: str = Form(...),
    event_start: str = Form(...),
    event_end: str = Form(...),
    color: str = Form("blue"),
    completed: bool = Form(False),
    event_notes: str = Form(""),
    token: str = Depends(oauth2_scheme)
):
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    update_event(event_id, event_name, event_date, event_start, event_end, color, completed, event_notes)
    return JSONResponse(content={"status": "success"}, status_code=200)

@app.delete("/api/events/delete/{event_id}")
async def remove_event(event_id: int, token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    delete_event(event_id)
    return JSONResponse(content={"status": "success"}, status_code=200)

@app.get("/", response_class=HTMLResponse)
async def read_login():
    with open("templates/login.html") as file:
        return HTMLResponse(content=file.read())

@app.get("/register", response_class=HTMLResponse)
async def get_register_page():
    with open("templates/signup.html") as file:
        return HTMLResponse(content=file.read())

@app.get("/home", response_class=HTMLResponse)
async def read_homepage():
    with open("templates/homepage.html", encoding="utf-8") as file:
        return HTMLResponse(content=file.read())

@app.get("/calendar", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/calendar.html", encoding="utf-8") as file:
        return HTMLResponse(content=file.read())
@app.get("/gpa", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/gpa.html",  encoding="utf-8") as file:
        return HTMLResponse(content=file.read())
    
@app.get("/study_result", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/study_result.html",  encoding="utf-8") as file:
        return HTMLResponse(content=file.read())
        
@app.get("/study_target", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/study_target.html",  encoding="utf-8") as file:
        return HTMLResponse(content=file.read())

@app.get("/study_statistics", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/study_statistics.html",  encoding="utf-8") as file:
        return HTMLResponse(content=file.read())
    
@app.get("/notice", response_class=HTMLResponse)
async def read_calendar():
    with open("templates/notice.html",  encoding="utf-8") as file:
        return HTMLResponse(content=file.read())

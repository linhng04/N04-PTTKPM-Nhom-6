import sqlite3
from passlib.context import CryptContext

# Băm mật khẩu với bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db_connection():
    """Kết nối đến cơ sở dữ liệu SQLite"""
    conn = sqlite3.connect('user_data.db', timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    """Tạo bảng users và events nếu chưa tồn tại"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Tạo bảng users
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Tạo bảng events
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                event_name TEXT NOT NULL,
                event_date TEXT NOT NULL,
                event_start TEXT NOT NULL,
                event_end TEXT NOT NULL,
                color TEXT DEFAULT 'blue',
                completed BOOLEAN DEFAULT 0,
                event_notes TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()

def get_password_hash(password: str) -> str:
    """Băm mật khẩu"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Xác minh mật khẩu"""
    return pwd_context.verify(plain_password, hashed_password)

def insert_user(username: str, email: str, password: str) -> bool:
    """Thêm người dùng vào database"""
    hashed_password = get_password_hash(password)
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                           (username, email, hashed_password))
            conn.commit()
        return True
    except sqlite3.IntegrityError as e:
        print(f"Lỗi khi thêm người dùng: {e}")
        return False

def get_user(username: str):
    """Lấy thông tin người dùng từ database"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        user = cursor.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    
    return dict(user) if user else None  # ✅ Chuyển sqlite3.Row thành dictionary


def insert_event(user_id: int, event_name: str, event_date: str, event_start: str, event_end: str, color: str, completed: bool, event_notes: str):
    """Thêm sự kiện vào database"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO events (user_id, event_name, event_date, event_start, event_end, color, completed, event_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                           (user_id, event_name, event_date, event_start, event_end, color, completed, event_notes))
            conn.commit()
    except sqlite3.Error as e:
        print(f"Lỗi khi thêm sự kiện: {e}")

def get_events_by_user(user_id: int):
    """Lấy tất cả sự kiện của người dùng"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        events = cursor.execute("SELECT * FROM events WHERE user_id = ?", (user_id,)).fetchall()
    return [dict(event) for event in events]

def delete_event(event_id: int):
    """Xóa sự kiện theo ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM events WHERE id = ?", (event_id,))
            conn.commit()
    except sqlite3.Error as e:
        print(f"Lỗi khi xóa sự kiện: {e}")

def update_event(event_id: int, event_name: str, event_date: str, event_start: str, event_end: str, color: str, completed: bool, event_notes: str):
    """Cập nhật sự kiện theo ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE events
                SET event_name = ?, event_date = ?, event_start = ?, event_end = ?, color = ?, completed = ?, event_notes = ?
                WHERE id = ?
            """, (event_name, event_date, event_start, event_end, color, completed, event_notes, event_id))
            conn.commit()
    except sqlite3.Error as e:
        print(f"Lỗi khi cập nhật sự kiện: {e}")

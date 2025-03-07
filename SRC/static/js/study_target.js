function calculateGrade(element) {
    const row = element.closest('tr');
    const attendance = parseFloat(row.querySelector('.attendance').value) || 0;
    const midterm = parseFloat(row.querySelector('.midterm').value) || 0;
    const final = parseFloat(row.querySelector('.final').value) || 0;
    const credits = parseFloat(row.querySelector('.credits').value) || 0;

    const weightInput = row.querySelector('.weight').value;
    const weights = weightInput.split(':').map(w => parseFloat(w.trim()) / 100); 

    const average10 = (attendance * (weights[0] || 0) + midterm * (weights[1] || 0) + final * (weights[2] || 0)).toFixed(2);
    row.querySelector('.avg-10').textContent = average10;


    const average4 = (average10 / 10 * 4).toFixed(2);
    row.querySelector('.avg-4').textContent = average4;


    let grade;
    if (average10 >= 9 && average10 <= 10) grade = 'A+';
    else if (average10 >= 8.5 && average10 < 9) grade = 'A';
    else if (average10 >= 8 && average10 < 8.5) grade = 'B+';
    else if (average10 >= 7 && average10 < 8) grade = 'B';
    else if (average10 >= 6.5 && average10 < 7) grade = 'C+';
    else if (average10 >= 5.5 && average10 < 6.5) grade = 'C';
    else if (average10 >= 5 && average10 < 5.5) grade = 'D+';
    else if (average10 >= 4 && average10 < 5) grade = 'D';
    else grade = 'F';
    row.querySelector('.grade').textContent = grade;

    calculateOverallAverage();
}

function addSubject() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td><input type="text" class="subject-name" placeholder="Tên môn"></td>
            <td><input type="number" class="credits" placeholder="Số tín" onchange="calculateGrade(this)"></td>
            <td><input type="number" class="attendance" placeholder="Chuyên cần" onchange="calculateGrade(this)"></td>
            <td><input type="number" class="midterm" placeholder="Thi giữa kỳ" onchange="calculateGrade(this)"></td>
            <td><input type="number" class="final" placeholder="Thi cuối kỳ" onchange="calculateGrade(this)"></td>
            <td><input type="text" class="weight" placeholder="Tỉ lệ (vd: 30%: 20%: 50%)" onchange="calculateGrade(this)"></td>
            <td class="avg-10"></td>
            <td class="avg-4"></td>
            <td class="grade"></td>
        `;
    document.getElementById('subjectTable').appendChild(newRow);
}

function calculateOverallAverage() {
    const rows = document.querySelectorAll('#subjectTable tr');
    let totalCredits = 0;
    let totalWeightedScore10 = 0;
    let totalWeightedScore4 = 0;

    rows.forEach(row => {
        const credits = parseFloat(row.querySelector('.credits').value) || 0;
        const avg10 = parseFloat(row.querySelector('.avg-10').textContent) || 0;
        const avg4 = parseFloat(row.querySelector('.avg-4').textContent) || 0;

        totalCredits += credits;
        totalWeightedScore10 += avg10 * credits;
        totalWeightedScore4 += avg4 * credits;
    });

    const overallAvg10 = (totalWeightedScore10 / totalCredits).toFixed(2) || 0;
    const overallAvg4 = (totalWeightedScore4 / totalCredits).toFixed(2) || 0;

    document.getElementById('overallAvg10').innerHTML = `Trung Bình Tất Cả (Hệ 10): <strong>${overallAvg10}</strong>`;
    document.getElementById('overallAvg4').innerHTML = `Trung Bình Tất Cả (Hệ 4): <strong>${overallAvg4}</strong>`;
}
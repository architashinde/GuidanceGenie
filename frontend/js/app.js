document.getElementById('careerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const interests = Array.from(document.getElementById('interests').selectedOptions)
    .map(option => option.value);
  const skills = document.getElementById('skills').value.split(',');
  const email = document.getElementById('email').value;
  
  try {
    const response = await fetch('http://localhost:5000/api/career/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interests, skills, email })
    });
    
    const recommendations = await response.json();
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
    window.location.href = 'results.html';
  } catch (error) {
    alert('Error getting recommendations');
  }
});
document.getElementById("startBtn").addEventListener("click", async () => {
  try {
    // Call your backend API
    const response = await fetch("http://localhost:3000/api/careers");
    const data = await response.json();

    // Save result for results page
    localStorage.setItem("careerResult", JSON.stringify(data));

    // Move to results page
    window.location.href = "results.html";
  } catch (error) {
    alert("Backend not connected!");
    console.error(error);
  }
});

const ctx = document.getElementById('myChart');
function createChart(messageDate) {
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: messageDate.map(row => row.MessageDate),
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
};
// Homework: Dynamic Teams Board

const leaderboard = d3.select('#leaderboard');

// Initial teams data
let teams = [
    { name: 'Real Madrid', points: 45, goalsFor: 40, goalsAgainst: 15 },
    { name: 'Manchester City', points: 42, goalsFor: 45, goalsAgainst: 18 },
    { name: 'Bayern Munich', points: 40, goalsFor: 38, goalsAgainst: 12 },
    { name: 'Liverpool', points: 38, goalsFor: 35, goalsAgainst: 20 },
    { name: 'Paris Saint-Germain', points: 35, goalsFor: 30, goalsAgainst: 22 },
    { name: 'Arsenal', points: 33, goalsFor: 32, goalsAgainst: 19 },
    { name: 'Inter Milan', points: 30, goalsFor: 28, goalsAgainst: 21 }
];

// Potential new teams pool
const potentialTeams = [
    'Barcelona', 'AC Milan', 'Borussia Dortmund', 'Napoli', 'Atletico Madrid', 
    'Bayer Leverkusen', 'Juventus', 'Chelsea', 'Tottenham', 'Porto'
];

// Function to update the board (placeholder for now)
function updateBoard(data) {
    // TODO: Sort data by points descending, then goal difference

    // TODO: Use selectAll.data().join() for enter-update-exit
    // Enter: new teams slide in
    // Update: teams move to new positions, update scores
    // Exit: teams slide out

    // TODO: For each team div, set position, name, points, gd
    console.log('Board updated with data:', data);
}

// Function to simulate data changes
function updateData() {
    // 1. Update points/goals for existing teams
    teams.forEach(team => {
        if (Math.random() > 0.5) {
            const goals = Math.floor(Math.random() * 3);
            team.points += Math.random() > 0.7 ? 3 : (Math.random() > 0.5 ? 1 : 0);
            team.goalsFor += goals;
            team.goalsAgainst += Math.floor(Math.random() * 2);
        }
    });

    // 2. Occasionally add a new team
    if (Math.random() > 0.8 && potentialTeams.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialTeams.length);
        const newTeamName = potentialTeams.splice(randomIndex, 1)[0];
        teams.push({
            name: newTeamName,
            points: Math.min(...teams.map(t => t.points)) + Math.floor(Math.random() * 5),
            goalsFor: Math.floor(Math.random() * 10),
            goalsAgainst: Math.floor(Math.random() * 10)
        });
        console.log(`Added team: ${newTeamName}`);
    }

    // 3. Occasionally remove a team
    if (Math.random() > 0.9 && teams.length > 5) {
        const randomIndex = Math.floor(Math.random() * teams.length);
        const removedTeam = teams.splice(randomIndex, 1)[0];
        potentialTeams.push(removedTeam.name);
        console.log(`Removed team: ${removedTeam.name}`);
    }

    updateBoard(teams);
}

// TODO: Set interval to update data every 2-3 seconds
// setInterval(() => { updateData(); updateBoard(currentData); }, 2000);

// Initial call
updateBoard(teams);
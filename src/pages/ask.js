// Exported async function that takes number of rounds as input
export default async function getRandomDataSet(rounds) {
    const response = await fetch('http://localhost:5000/api/dataSet');
    const dataSet = await response.json();
  
    const result = [];
    const usedIndices = new Set();
  
    while (result.length < rounds) {
      const randomIndex = Math.floor(Math.random() * dataSet.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        result.push(dataSet[randomIndex]);
      }
    }
    return result;

  }
  
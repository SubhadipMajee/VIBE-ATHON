export const regionsData = [
  { id: 'wb', name: 'West Bengal' },
  { id: 'pb', name: 'Punjab' },
  { id: 'mh', name: 'Maharashtra' },
  { id: 'gj', name: 'Gujarat' },
  { id: 'up', name: 'Uttar Pradesh' },
  { id: 'mp', name: 'Madhya Pradesh' },
  { id: 'ka', name: 'Karnataka' },
  { id: 'ap', name: 'Andhra Pradesh' },
];

// Mock monthly weather data (temp in C, rainfall in mm)
const generateWeatherData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {};
  
  regionsData.forEach(region => {
    data[region.id] = months.reduce((acc, month, index) => {
      // Create some basic variation
      const baseTemp = 20 + Math.sin(index / 11 * Math.PI) * 15;
      const baseRain = index >= 5 && index <= 8 ? 200 + Math.random() * 100 : 10 + Math.random() * 30;
      
      acc[month] = {
        temp: Math.round(baseTemp),
        rainfall: Math.round(baseRain),
        alert: baseRain > 250 ? 'Heavy Rain Expected' : baseTemp > 33 ? 'Heatwave Alert' : null
      };
      return acc;
    }, {});
  });
  
  return data;
};

export const weatherData = generateWeatherData();

export const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

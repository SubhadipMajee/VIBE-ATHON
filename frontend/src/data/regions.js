export const regionsData = [
  { id: 'ap', name: 'Andhra Pradesh' },
  { id: 'ar', name: 'Arunachal Pradesh' },
  { id: 'as', name: 'Assam' },
  { id: 'br', name: 'Bihar' },
  { id: 'cg', name: 'Chhattisgarh' },
  { id: 'ga', name: 'Goa' },
  { id: 'gj', name: 'Gujarat' },
  { id: 'hr', name: 'Haryana' },
  { id: 'hp', name: 'Himachal Pradesh' },
  { id: 'jh', name: 'Jharkhand' },
  { id: 'ka', name: 'Karnataka' },
  { id: 'kl', name: 'Kerala' },
  { id: 'mp', name: 'Madhya Pradesh' },
  { id: 'mh', name: 'Maharashtra' },
  { id: 'mn', name: 'Manipur' },
  { id: 'ml', name: 'Meghalaya' },
  { id: 'mz', name: 'Mizoram' },
  { id: 'nl', name: 'Nagaland' },
  { id: 'od', name: 'Odisha' },
  { id: 'pb', name: 'Punjab' },
  { id: 'rj', name: 'Rajasthan' },
  { id: 'sk', name: 'Sikkim' },
  { id: 'tn', name: 'Tamil Nadu' },
  { id: 'ts', name: 'Telangana' },
  { id: 'tr', name: 'Tripura' },
  { id: 'up', name: 'Uttar Pradesh' },
  { id: 'uk', name: 'Uttarakhand' },
  { id: 'wb', name: 'West Bengal' },
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

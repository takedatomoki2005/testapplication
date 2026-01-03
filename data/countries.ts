export interface Country {
  name: string
  code: string
  region: 'Asia' | 'Europe' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Middle East'
  language: string
  description: string
  population: number // in millions
}

export const countries: Country[] = [
  { name: 'Afghanistan', code: 'AF', region: 'Asia', language: 'Pashto, Dari', description: 'Landlocked country in Central Asia with rich history', population: 40.1 },
  { name: 'Albania', code: 'AL', region: 'Europe', language: 'Albanian', description: 'Balkan country with beautiful Adriatic coastline', population: 2.8 },
  { name: 'Algeria', code: 'DZ', region: 'Africa', language: 'Arabic, Berber', description: 'Largest country in Africa with diverse landscapes', population: 45.4 },
  { name: 'Argentina', code: 'AR', region: 'South America', language: 'Spanish', description: 'Second largest country in South America, known for tango and beef', population: 45.8 },
  { name: 'Australia', code: 'AU', region: 'Oceania', language: 'English', description: 'Island continent with unique wildlife and diverse landscapes', population: 26.0 },
  { name: 'Austria', code: 'AT', region: 'Europe', language: 'German', description: 'Alpine country in Central Europe, birthplace of classical music', population: 9.0 },
  { name: 'Bangladesh', code: 'BD', region: 'Asia', language: 'Bengali', description: 'Densely populated South Asian country with rich culture', population: 169.4 },
  { name: 'Belgium', code: 'BE', region: 'Europe', language: 'Dutch, French, German', description: 'Small European country known for chocolate and beer', population: 11.6 },
  { name: 'Brazil', code: 'BR', region: 'South America', language: 'Portuguese', description: 'Largest country in South America, home to Amazon rainforest', population: 215.3 },
  { name: 'Bulgaria', code: 'BG', region: 'Europe', language: 'Bulgarian', description: 'Balkan country with Black Sea coastline', population: 6.8 },
  { name: 'Canada', code: 'CA', region: 'North America', language: 'English, French', description: 'Second largest country in the world, known for natural beauty', population: 38.3 },
  { name: 'Chile', code: 'CL', region: 'South America', language: 'Spanish', description: 'Long narrow country along South America\'s Pacific coast', population: 19.5 },
  { name: 'China', code: 'CN', region: 'Asia', language: 'Mandarin', description: 'Most populous country with ancient civilization', population: 1409.7 },
  { name: 'Colombia', code: 'CO', region: 'South America', language: 'Spanish', description: 'Diverse South American country with coffee culture', population: 51.5 },
  { name: 'Croatia', code: 'HR', region: 'Europe', language: 'Croatian', description: 'Adriatic country with stunning coastline and historic cities', population: 3.9 },
  { name: 'Czech Republic', code: 'CZ', region: 'Europe', language: 'Czech', description: 'Central European country known for beer and castles', population: 10.5 },
  { name: 'Denmark', code: 'DK', region: 'Europe', language: 'Danish', description: 'Nordic country known for design and happiness', population: 5.9 },
  { name: 'Egypt', code: 'EG', region: 'Africa', language: 'Arabic', description: 'Ancient civilization with pyramids and Nile River', population: 109.3 },
  { name: 'Finland', code: 'FI', region: 'Europe', language: 'Finnish, Swedish', description: 'Nordic country known for saunas and design', population: 5.5 },
  { name: 'France', code: 'FR', region: 'Europe', language: 'French', description: 'Cultural capital known for art, cuisine, and fashion', population: 67.8 },
  { name: 'Germany', code: 'DE', region: 'Europe', language: 'German', description: 'Largest economy in Europe with rich history', population: 83.2 },
  { name: 'Greece', code: 'GR', region: 'Europe', language: 'Greek', description: 'Birthplace of democracy with ancient ruins and islands', population: 10.4 },
  { name: 'Hungary', code: 'HU', region: 'Europe', language: 'Hungarian', description: 'Central European country known for thermal baths', population: 9.7 },
  { name: 'Iceland', code: 'IS', region: 'Europe', language: 'Icelandic', description: 'Volcanic island with geysers and Northern Lights', population: 0.4 },
  { name: 'India', code: 'IN', region: 'Asia', language: 'Hindi, English', description: 'Diverse subcontinent with rich culture and history', population: 1407.6 },
  { name: 'Indonesia', code: 'ID', region: 'Asia', language: 'Indonesian', description: 'Largest archipelago with thousands of islands', population: 275.8 },
  { name: 'Iran', code: 'IR', region: 'Middle East', language: 'Persian', description: 'Ancient Persian empire with rich cultural heritage', population: 88.6 },
  { name: 'Ireland', code: 'IE', region: 'Europe', language: 'English, Irish', description: 'Emerald Isle known for pubs and friendly people', population: 5.0 },
  { name: 'Israel', code: 'IL', region: 'Middle East', language: 'Hebrew, Arabic', description: 'Historic land with religious significance', population: 9.6 },
  { name: 'Italy', code: 'IT', region: 'Europe', language: 'Italian', description: 'Boot-shaped country known for art, food, and history', population: 58.9 },
  { name: 'Japan', code: 'JP', region: 'Asia', language: 'Japanese', description: 'Island nation known for technology and traditional culture', population: 125.1 },
  { name: 'Kenya', code: 'KE', region: 'Africa', language: 'Swahili, English', description: 'East African country famous for wildlife safaris', population: 55.0 },
  { name: 'Malaysia', code: 'MY', region: 'Asia', language: 'Malay', description: 'Southeast Asian country with diverse culture', population: 33.9 },
  { name: 'Mexico', code: 'MX', region: 'North America', language: 'Spanish', description: 'Vibrant country with rich cuisine and ancient ruins', population: 128.9 },
  { name: 'Morocco', code: 'MA', region: 'Africa', language: 'Arabic, Berber', description: 'North African country with colorful markets', population: 37.8 },
  { name: 'Netherlands', code: 'NL', region: 'Europe', language: 'Dutch', description: 'Low-lying country known for tulips and windmills', population: 17.5 },
  { name: 'New Zealand', code: 'NZ', region: 'Oceania', language: 'English, Maori', description: 'Island nation with stunning natural beauty', population: 5.1 },
  { name: 'Nigeria', code: 'NG', region: 'Africa', language: 'English', description: 'Most populous African country with diverse culture', population: 223.8 },
  { name: 'Norway', code: 'NO', region: 'Europe', language: 'Norwegian', description: 'Nordic country with fjords and Northern Lights', population: 5.5 },
  { name: 'Pakistan', code: 'PK', region: 'Asia', language: 'Urdu, English', description: 'South Asian country with diverse landscapes', population: 240.5 },
  { name: 'Peru', code: 'PE', region: 'South America', language: 'Spanish, Quechua', description: 'Home to Machu Picchu and ancient Incan civilization', population: 33.7 },
  { name: 'Philippines', code: 'PH', region: 'Asia', language: 'Filipino, English', description: 'Archipelago with beautiful beaches and friendly people', population: 115.6 },
  { name: 'Poland', code: 'PL', region: 'Europe', language: 'Polish', description: 'Central European country with rich history', population: 37.7 },
  { name: 'Portugal', code: 'PT', region: 'Europe', language: 'Portuguese', description: 'Iberian country known for port wine and beaches', population: 10.3 },
  { name: 'Romania', code: 'RO', region: 'Europe', language: 'Romanian', description: 'Eastern European country with Carpathian Mountains', population: 19.0 },
  { name: 'Russia', code: 'RU', region: 'Europe', language: 'Russian', description: 'Largest country in the world spanning two continents', population: 143.4 },
  { name: 'Saudi Arabia', code: 'SA', region: 'Middle East', language: 'Arabic', description: 'Oil-rich kingdom with Islamic heritage', population: 36.4 },
  { name: 'Singapore', code: 'SG', region: 'Asia', language: 'English, Malay, Mandarin, Tamil', description: 'Modern city-state and financial hub', population: 5.9 },
  { name: 'South Africa', code: 'ZA', region: 'Africa', language: 'English, Afrikaans, Zulu', description: 'Diverse nation at the southern tip of Africa', population: 60.4 },
  { name: 'South Korea', code: 'KR', region: 'Asia', language: 'Korean', description: 'Tech-savvy nation with K-pop and ancient traditions', population: 51.7 },
  { name: 'Spain', code: 'ES', region: 'Europe', language: 'Spanish', description: 'Iberian country known for flamenco and architecture', population: 47.6 },
  { name: 'Sweden', code: 'SE', region: 'Europe', language: 'Swedish', description: 'Nordic country known for design and innovation', population: 10.5 },
  { name: 'Switzerland', code: 'CH', region: 'Europe', language: 'German, French, Italian, Romansh', description: 'Alpine country known for chocolate and banking', population: 8.8 },
  { name: 'Taiwan', code: 'TW', region: 'Asia', language: 'Mandarin', description: 'Island nation known for technology and night markets', population: 23.9 },
  { name: 'Thailand', code: 'TH', region: 'Asia', language: 'Thai', description: 'Southeast Asian kingdom known for temples and beaches', population: 71.6 },
  { name: 'Turkey', code: 'TR', region: 'Middle East', language: 'Turkish', description: 'Bridge between Europe and Asia with rich history', population: 85.3 },
  { name: 'Ukraine', code: 'UA', region: 'Europe', language: 'Ukrainian', description: 'Eastern European country with fertile plains', population: 43.8 },
  { name: 'United Arab Emirates', code: 'AE', region: 'Middle East', language: 'Arabic', description: 'Modern federation known for luxury and innovation', population: 10.1 },
  { name: 'United Kingdom', code: 'GB', region: 'Europe', language: 'English', description: 'Island nation with royal heritage and history', population: 67.8 },
  { name: 'United States', code: 'US', region: 'North America', language: 'English', description: 'Diverse nation with varied landscapes and culture', population: 339.9 },
  { name: 'Vietnam', code: 'VN', region: 'Asia', language: 'Vietnamese', description: 'Southeast Asian country with rich history and cuisine', population: 98.2 },
]

// Sort countries alphabetically by name
countries.sort((a, b) => a.name.localeCompare(b.name))


import * as fs from 'fs';
import * as xlsx from 'xlsx';

const generateData = () => {
  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
  const occasions = ['Birthday', 'Work Anniversary'];
  
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const data = [];
  
  // Let's generate 50 entries
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
    const department = departments[Math.floor(Math.random() * departments.length)];
    const occasion = occasions[Math.floor(Math.random() * occasions.length)];
    
    // Generate a random date in 2026
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    
    // Format date as YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];

    data.push({
      Name: name,
      Email: email,
      Department: department,
      Occasion: occasion,
      EventDate: dateStr
    });
  }
  
  return data;
};

const run = () => {
  const data = generateData();
  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  
  // Add column widths for better appearance
  worksheet['!cols'] = [
    { wch: 20 }, // Name
    { wch: 30 }, // Email
    { wch: 15 }, // Department
    { wch: 18 }, // Occasion
    { wch: 12 }, // EventDate
  ];

  xlsx.utils.book_append_sheet(workbook, worksheet, 'Events');
  
  // Write the file to the public directory
  xlsx.writeFile(workbook, './public/demo.xlsx');
  console.log('Successfully generated public/demo.xlsx with 50 entries.');
};

run();

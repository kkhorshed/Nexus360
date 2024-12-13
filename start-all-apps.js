const { exec } = require('child_process');

const apps = [
  { name: 'Frontend Platform', path: 'frontend', port: 3000 },
  { name: 'AI Chat', path: 'apps/ai-chat', port: 3020 },
  { name: 'CRM', path: 'apps/crm', port: 3010 },
  { name: 'Forecasting', path: 'apps/forecasting', port: 3040 },
  { name: 'Marketing', path: 'apps/marketing', port: 3050 },
  { name: 'Sales Compensation', path: 'apps/sales-comp', port: 3030 },
];

apps.forEach((app) => {
  const command = `cd ${app.path} && npx vite --port ${app.port}`;
  console.log(`Starting ${app.name} on port ${app.port}...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting ${app.name}:`, error);
      return;
    }
    console.log(`${app.name} output:`, stdout);
    console.error(`${app.name} errors:`, stderr);
  });
});

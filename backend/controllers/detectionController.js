const { spawn } = require('child_process');

exports.detectDamage = (req, res) => {
  const image = req.file.path;
  const pythonProcess = spawn('python3', ['path_to_cnn_script.py', image]);

  pythonProcess.stdout.on('data', (data) => {
    const result = data.toString();
    res.json({ result });
  });

  pythonProcess.stderr.on('data', (data) => {
    res.status(500).json({ error: 'Error processing image' });
  });
};

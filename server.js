// server.js — YT-automation local web server
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { exec, spawn } = require('child_process');
const https = require('https');
const multer = require('multer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Directories
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const MEDIA_DIR = path.join(__dirname, 'data', 'media');
const ASSETS_DIR = path.join(MEDIA_DIR, 'assets');
const MUSIC_DIR = path.join(MEDIA_DIR, 'music');
const SFX_DIR = path.join(MEDIA_DIR, 'sfx');
const BIN_DIR = path.join(__dirname, 'bin');
const STYLE_PATH = path.join(__dirname, 'data', 'style.txt');
const DISCOVERY_CONFIG_PATH = path.join(__dirname, 'data', 'discovery_config.json');
const YT_CREDENTIALS_PATH = path.join(__dirname, 'data', 'youtube_credentials.json');
const YTDLP_PATH = path.join(BIN_DIR, 'yt-dlp.exe');

// Progress tracking cache
const renderProgressMap = {};

// Create directories if they don't exist
const dirs = [path.dirname(DB_PATH), MEDIA_DIR, ASSETS_DIR, MUSIC_DIR, SFX_DIR, BIN_DIR];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route based on query param: ?type=sfx uploads to SFX folder
    if (req.query.type === 'sfx' && file.mimetype.startsWith('audio/')) {
      cb(null, SFX_DIR);
    } else if (file.mimetype.startsWith('audio/')) {
      cb(null, MUSIC_DIR);
    } else {
      cb(null, ASSETS_DIR);
    }
  },
  filename: (req, file, cb) => {
    // Keep original name but escape spaces
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '_' + cleanName);
  }
});
const upload = multer({ storage });

// Background Downloader for yt-dlp.exe (Windows)
function ensureYtdlp() {
  if (fs.existsSync(YTDLP_PATH)) {
    console.log('✔ yt-dlp.exe is ready.');
    return;
  }
  console.log('📥 yt-dlp.exe not found. Downloading in the background...');
  const url = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe';
  
  const file = fs.createWriteStream(YTDLP_PATH);
  https.get(url, (response) => {
    // Handle redirect
    if (response.statusCode === 301 || response.statusCode === 302) {
      https.get(response.headers.location, (res) => {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('✔ yt-dlp.exe downloaded successfully.');
        });
      });
    } else {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('✔ yt-dlp.exe downloaded successfully.');
      });
    }
  }).on('error', (err) => {
    fs.unlink(YTDLP_PATH, () => {});
    console.error('❌ Failed to download yt-dlp.exe:', err);
  });
}
ensureYtdlp();

// Database Helper Actions
function readDb() {
  if (!fs.existsSync(DB_PATH)) return { shorts: [] };
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data || '{"shorts":[]}');
}
function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Write default style guidelines if empty
if (!fs.existsSync(STYLE_PATH)) {
  fs.writeFileSync(STYLE_PATH, 'Write in an engaging, fast-paced educational style. Short sentences.', 'utf8');
}

// API Routes

// Style guidelines endpoints
app.get('/api/style', (req, res) => {
  try {
    const text = fs.readFileSync(STYLE_PATH, 'utf8');
    res.json({ style: text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read style guidelines.' });
  }
});

app.post('/api/style', (req, res) => {
  try {
    const { style } = req.body;
    fs.writeFileSync(STYLE_PATH, style || '', 'utf8');
    res.json({ success: true, message: 'Style guidelines updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save style guidelines.' });
  }
});

// Discovery Config endpoints
app.get('/api/discovery-config', (req, res) => {
  try {
    if (!fs.existsSync(DISCOVERY_CONFIG_PATH)) {
      return res.json({
        youtubeApiKey: '',
        youtubeQuery: '',
        instaEndpoint: '',
        instaApiKey: '',
        instaQuery: '',
        tiktokEndpoint: '',
        tiktokApiKey: '',
        tiktokQuery: '',
        redditQuery: 'satisfying, specializedtools',
        minScore: 1000,
        maxResults: 10,
        autoPipelineEnabled: false,
        dailyTime: '10:00',
        defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',
        defaultMusic: 'random',
        defaultMusicVolume: 12,
        lastAutoRunDate: ''
      });
    }
    const data = fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read discovery config.' });
  }
});

app.post('/api/discovery-config', (req, res) => {
  try {
    fs.writeFileSync(DISCOVERY_CONFIG_PATH, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, message: 'Discovery configuration saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save discovery config.' });
  }
});

// YouTube OAuth Status
app.get('/api/youtube/status', (req, res) => {
  const status = fs.existsSync(YT_CREDENTIALS_PATH);
  res.json({ authenticated: status });
});

// YouTube Auth Consent URL
app.get('/api/youtube/auth-url', (req, res) => {
  try {
    if (!fs.existsSync(DISCOVERY_CONFIG_PATH)) {
      return res.status(400).json({ error: 'Config details missing. Please configure Client ID first.' });
    }
    const config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));
    const clientId = config.youtubeClientId;
    if (!clientId) {
      return res.status(400).json({ error: 'YouTube Client ID missing in config.' });
    }

    const redirectUri = 'http://localhost:3000/api/youtube/oauth-callback';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload&access_type=offline&prompt=consent`;

    res.json({ authUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// YouTube OAuth Callback
app.get('/api/youtube/oauth-callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authentication code is missing.');
  }

  try {
    const config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));
    const clientId = config.youtubeClientId;
    const clientSecret = config.youtubeClientSecret;
    const redirectUri = 'http://localhost:3000/api/youtube/oauth-callback';

    if (!clientId || !clientSecret) {
      return res.status(400).send('Client credentials missing in config.');
    }

    // Exchange code for token
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString()
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${await response.text()}`);
    }

    const tokens = await response.json();
    fs.writeFileSync(YT_CREDENTIALS_PATH, JSON.stringify(tokens, null, 2), 'utf8');

    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc; color: #0f172a;">
          <h2 style="color: #2563eb;">✓ YouTube Authentication Successful!</h2>
          <p>Your workspace is authenticated. You can safely close this window now.</p>
          <script>
            setTimeout(() => window.close(), 2000);
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('YouTube OAuth Error:', err);
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

// Music CRUD Endpoints
app.get('/api/music', (req, res) => {
  try {
    const files = fs.existsSync(MUSIC_DIR) ? fs.readdirSync(MUSIC_DIR) : [];
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read music list.' });
  }
});

app.delete('/api/music/:filename', (req, res) => {
  try {
    const filePath = path.join(MUSIC_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: 'Track deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete track.' });
  }
});

// Sound Effects (SFX) CRUD Endpoints
app.get('/api/sfx', (req, res) => {
  try {
    const files = fs.existsSync(SFX_DIR) ? fs.readdirSync(SFX_DIR) : [];
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read SFX list.' });
  }
});

app.delete('/api/sfx/:filename', (req, res) => {
  try {
    const filePath = path.join(SFX_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: 'Sound effect deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sound effect.' });
  }
});

// Auto-discovery multi-provider scraper route
app.post('/api/auto-discover', async (req, res) => {
  try {
    let config = {
      youtubeApiKey: '',
      youtubeQuery: '',
      instaEndpoint: '',
      instaApiKey: '',
      instaQuery: '',
      tiktokEndpoint: '',
      tiktokApiKey: '',
      tiktokQuery: '',
      redditQuery: 'satisfying, specializedtools',
      minScore: 1000,
      maxResults: 10
    };

    if (fs.existsSync(DISCOVERY_CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));
    }

    const addedCount = await runCrawlInternal(config);
    res.json({ success: true, addedCount });
  } catch (error) {
    console.error('Auto-discovery failed:', error);
    res.status(500).json({ error: error.message || 'Auto-discovery scan failed.' });
  }
});

// Assets listing
app.get('/api/assets', (req, res) => {
  try {
    const musicFiles = fs.readdirSync(MUSIC_DIR).map(f => ({ name: f, type: 'audio', url: `/media/music/${f}` }));
    const assetFiles = fs.readdirSync(ASSETS_DIR).map(f => ({ name: f, type: 'image', url: `/media/assets/${f}` }));
    res.json({ music: musicFiles, assets: assetFiles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list assets.' });
  }
});

// Upload asset
app.post('/api/upload-asset', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const isAudio = req.file.mimetype.startsWith('audio/');
  const isSfx = req.query.type === 'sfx' && isAudio;
  const relativeUrl = isSfx
    ? `/media/sfx/${req.file.filename}`
    : isAudio ? `/media/music/${req.file.filename}` : `/media/assets/${req.file.filename}`;
  res.json({ success: true, filename: req.file.filename, url: relativeUrl, type: isSfx ? 'sfx' : isAudio ? 'audio' : 'image' });
});

// Shorts CRUD
app.get('/api/shorts', (req, res) => {
  res.json(readDb().shorts);
});

app.post('/api/shorts', (req, res) => {
  const db = readDb();
  const { sourceUrl, sourceNotes, visualTheme } = req.body;

  if (!sourceUrl) {
    return res.status(400).json({ error: 'Source URL is required.' });
  }

  const today = new Date();
  const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
  const prefix = `SHORT-${dateStr}`;
  const count = db.shorts.filter(s => s.id.startsWith(prefix)).length + 1;
  const newId = `${prefix}-${count}`;

  const newShort = {
    id: newId,
    status: 'Searching',
    visualTheme: visualTheme || 'Other',
    sourceUrl,
    sourceNotes: sourceNotes || '',
    monetizationSafety: 0,
    advertiserSafety: 0,
    viralPotential: 0,
    transformationPotential: 0,
    sourceRisk: 0,
    rejectionOverride: false,
    rejectionReason: '',
    finalScore: 0.0,
    editorialAngle: '',
    script: '',
    voiceoverAudio: '',
    editGuidelines: '',
    trimStart: 0,
    trimEnd: 30,
    cropPosition: 'center',
    backgroundMusic: 'none',
    musicVolume: 10,
    aiStylization: false,
    finalMp4: '',
    title: '',
    description: '',
    scheduleTime: '',
    youtubeUrl: '',
    views48h: 0,
    createdAt: new Date().toISOString()
  };

  db.shorts.push(newShort);
  writeDb(db);
  res.status(201).json(newShort);
});

app.put('/api/shorts/:id', (req, res) => {
  const db = readDb();
  const index = db.shorts.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Short not found.' });
  }

  const updatedShort = { ...db.shorts[index], ...req.body };
  const { monetizationSafety, advertiserSafety, viralPotential, transformationPotential, sourceRisk, rejectionOverride } = updatedShort;
  
  if (monetizationSafety < 6 || advertiserSafety < 6 || transformationPotential < 5 || sourceRisk < 5 || rejectionOverride) {
    updatedShort.finalScore = 0.0;
  } else {
    updatedShort.finalScore = parseFloat(
      (
        monetizationSafety * 0.30 +
        advertiserSafety * 0.25 +
        viralPotential * 0.20 +
        transformationPotential * 0.15 +
        sourceRisk * 0.10
      ).toFixed(2)
    );
  }

  db.shorts[index] = updatedShort;
  writeDb(db);
  res.json(updatedShort);
});

app.delete('/api/shorts/:id', (req, res) => {
  const db = readDb();
  db.shorts = db.shorts.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// YouTube Video In-App Uploader Route
app.post('/api/youtube/upload/:id', async (req, res) => {
  try {
    const db = readDb();
    const short = db.shorts.find(s => s.id === req.params.id);
    if (!short) return res.status(404).json({ error: 'Short not found.' });

    const videoPath = path.join(MEDIA_DIR, `${short.id}_draft.mp4`);
    if (!fs.existsSync(videoPath)) {
      return res.status(400).json({ error: 'Rendered video file missing. Please compile draft first.' });
    }

    if (!fs.existsSync(YT_CREDENTIALS_PATH)) {
      return res.status(400).json({ error: 'YouTube account not authenticated. Go to settings drawer.' });
    }

    const config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));
    const clientId = config.youtubeClientId;
    const clientSecret = config.youtubeClientSecret;
    const creds = JSON.parse(fs.readFileSync(YT_CREDENTIALS_PATH, 'utf8'));

    if (!clientId || !clientSecret) {
      return res.status(400).json({ error: 'OAuth client credentials missing in config.' });
    }

    // 1. Refresh Access Token
    const refreshParams = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: creds.refresh_token,
      grant_type: 'refresh_token'
    });

    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: refreshParams.toString()
    });

    if (!refreshResponse.ok) {
      throw new Error(`Failed to refresh token: ${await refreshResponse.text()}`);
    }

    const newTokens = await refreshResponse.json();
    creds.access_token = newTokens.access_token;
    fs.writeFileSync(YT_CREDENTIALS_PATH, JSON.stringify(creds, null, 2), 'utf8');

    // 2. Perform Resumable/Multipart Upload
    console.log(`[YOUTUBE] Uploading video ${short.id} to YouTube...`);
    const fileData = fs.readFileSync(videoPath);
    const boundary = 'shortsflow_upload_boundary';
    
    const metadata = {
      snippet: {
        title: short.title || `Short ${short.id}`,
        description: short.description || '#shorts',
        categoryId: '22'
      },
      status: {
        privacyStatus: 'private',
        selfDeclaredMadeForKids: false
      }
    };

    const headerBoundary = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
    const mediaBoundary = `\r\n--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`;
    const endBoundary = `\r\n--${boundary}--`;

    const bodyBuffer = Buffer.concat([
      Buffer.from(headerBoundary, 'utf8'),
      Buffer.from(mediaBoundary, 'utf8'),
      fileData,
      Buffer.from(endBoundary, 'utf8')
    ]);

    const uploadResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${creds.access_token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length.toString()
      },
      body: bodyBuffer
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`YouTube API returned: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();
    const videoId = uploadResult.id;
    const youtubeUrl = `https://youtube.com/shorts/${videoId}`;

    // Update short in DB
    const freshDb = readDb();
    const activeShort = freshDb.shorts.find(s => s.id === short.id);
    activeShort.youtubeUrl = youtubeUrl;
    activeShort.status = 'Uploaded';
    writeDb(freshDb);

    console.log(`[YOUTUBE] Video ${short.id} uploaded successfully! Link: ${youtubeUrl}`);
    res.json({ success: true, youtubeUrl });
  } catch (error) {
    console.error('[YOUTUBE UPLOAD ERROR]', error);
    res.status(500).json({ error: error.message || 'YouTube upload execution failed.' });
  }
});

// --- Core Production Pipeline Helpers (Callable internally or via API) ---

async function performYtDlpDownload(shortId, sourceUrl) {
  return new Promise((resolve, reject) => {
    const rawFile = path.join(MEDIA_DIR, `${shortId}_raw.mp4`);
    const cmd = `"${YTDLP_PATH}" -f "mp4" -o "${rawFile}" "${sourceUrl}"`;
    console.log(`[PIPELINE] Running yt-dlp: ${cmd}`);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('[PIPELINE] yt-dlp download failed:', stderr);
        return reject(new Error('yt-dlp download failed. Check video URL.'));
      }
      console.log('[PIPELINE] yt-dlp download complete.');
      resolve(rawFile);
    });
  });
}

async function performFfmpegRender(short, settings) {
  return new Promise((resolve, reject) => {
    let { trimStart, trimEnd, cropPosition, backgroundMusic, musicVolume, aiStylization } = settings;

    // --- AI Music & Volume Resolution ---
    // If 'auto' is chosen, pick a random track from the library (AI decides)
    if (backgroundMusic === 'auto' || backgroundMusic === 'random') {
      const musicFiles = fs.existsSync(MUSIC_DIR) ? fs.readdirSync(MUSIC_DIR) : [];
      backgroundMusic = musicFiles.length > 0
        ? musicFiles[Math.floor(Math.random() * musicFiles.length)]
        : 'none';
    }
    // If volume is null/undefined (AI mode), pick a tasteful default (12%)
    if (musicVolume === null || musicVolume === undefined) {
      musicVolume = 12;
    }

    const rawVideo = path.join(MEDIA_DIR, `${short.id}_raw.mp4`);
    const voiceover = path.join(MEDIA_DIR, `${short.id}_voice.mp3`);
    const outputVideo = path.join(MEDIA_DIR, `${short.id}_draft.mp4`);

    if (!fs.existsSync(rawVideo)) {
      return reject(new Error('Source video file missing.'));
    }
    if (!fs.existsSync(voiceover)) {
      return reject(new Error('Voiceover audio file missing.'));
    }

    let videoFilters = '';
    if (cropPosition === 'left') {
      videoFilters = 'crop=ih*9/16:ih:0:0';
    } else if (cropPosition === 'right') {
      videoFilters = 'crop=ih*9/16:ih:iw-ih*9/16:0';
    } else {
      videoFilters = 'crop=ih*9/16:ih:(iw-ih*9/16)/2:0'; // center default
    }

    if (aiStylization) {
      videoFilters += ',eq=contrast=1.2:saturation=1.4,colorbalance=rs=0.15:bs=0.25';
    }

    // Resolve SFX path
    const sfxFile = settings.soundEffect && settings.soundEffect !== 'none' ? settings.soundEffect : null;
    const sfxPath = sfxFile ? path.join(SFX_DIR, sfxFile) : null;
    const sfxExists = sfxPath && fs.existsSync(sfxPath);
    const sfxVolCoeff = 0.55; // SFX sit in the mix at 55% — prominent but not overpowering

    const musicPath = backgroundMusic !== 'none' ? path.join(MUSIC_DIR, backgroundMusic) : null;
    const musicVolCoeff = parseFloat((musicVolume / 100).toFixed(2)) || 0.12;
    const startSec = trimStart || 0;
    const duration = (trimEnd || 30) - startSec;

    // Assemble FFmpeg arguments for spawn
    const args = [
      '-ss', startSec.toString(),
      '-t', duration.toString(),
      '-i', rawVideo,
      '-i', voiceover
    ];

    const musicExists = musicPath && fs.existsSync(musicPath);
    if (musicExists) args.push('-i', musicPath);
    if (sfxExists)   args.push('-i', sfxPath);

    // Build filter_complex based on which audio streams are present
    // [0] = raw video/audio, [1] = voiceover, [2?] = music, [3?] = sfx
    let inputIdx = 2;
    const musicIdx = musicExists ? inputIdx++ : null;
    const sfxIdx   = sfxExists   ? inputIdx++ : null;
    const totalAudio = 1 + (musicExists ? 1 : 0) + (sfxExists ? 1 : 0) + 1; // raw + music? + sfx? + voice

    let audioMixParts = `[0:a]volume=0.08[a0];[1:a]volume=1.0[a1]`;
    let amixInputs = '[a0][a1]';
    let streamCount = 2;

    if (musicExists) {
      audioMixParts += `;[${musicIdx}:a]volume=${musicVolCoeff}[am]`;
      amixInputs += '[am]';
      streamCount++;
    }
    if (sfxExists) {
      audioMixParts += `;[${sfxIdx}:a]volume=${sfxVolCoeff}[as]`;
      amixInputs += '[as]';
      streamCount++;
    }

    const filterComplex = `[0:v]${videoFilters}[v];${audioMixParts};${amixInputs}amix=inputs=${streamCount}:duration=first[a]`;

    args.push(
      '-filter_complex', filterComplex,
      '-map', '[v]',
      '-map', '[a]',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '22',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-y', outputVideo
    );

    console.log(`[PIPELINE] Spawning FFmpeg with args: ${args.join(' ')}`);

    // Reset progress tracking variables
    renderProgressMap[short.id] = 0;

    const ffmpegProc = spawn('ffmpeg', args);

    ffmpegProc.stderr.on('data', (data) => {
      const output = data.toString();
      // Match "time=00:00:04.25"
      const match = output.match(/time=(\d+):(\d+):(\d+)\.(\d+)/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseInt(match[3]);
        const ms = parseInt(match[4]);
        
        const elapsed = (hours * 3600) + (minutes * 60) + seconds + (ms / 100);
        let pct = Math.min(100, Math.round((elapsed / duration) * 100));
        renderProgressMap[short.id] = pct;
        console.log(`[PIPELINE] FFmpeg Render Progress (${short.id}): ${pct}%`);
      }
    });

    ffmpegProc.on('close', (code) => {
      if (code === 0) {
        renderProgressMap[short.id] = 100;
        console.log(`[PIPELINE] FFmpeg rendering succeeded for ${short.id}`);
        resolve(`/media/${short.id}_draft.mp4`);
      } else {
        renderProgressMap[short.id] = -1; // Error state marker
        console.error(`[PIPELINE] FFmpeg render failed with exit code: ${code}`);
        reject(new Error(`FFmpeg rendering exited with code ${code}`));
      }
    });
  });
}

// Progress check API endpoint
app.get('/api/shorts/:id/render-progress', (req, res) => {
  const shortId = req.params.id;
  const progress = renderProgressMap[shortId] !== undefined ? renderProgressMap[shortId] : 0;
  res.json({ progress });
});

async function performSafetyAudit(notes, url) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const styleText = fs.existsSync(STYLE_PATH) ? fs.readFileSync(STYLE_PATH, 'utf8') : '';

  if (!geminiKey) {
    const content = `${notes} ${url}`.toLowerCase();
    const override = content.includes('religion') || content.includes('god') || content.includes('fight') || content.includes('crash');
    return {
      rejectionOverride: override,
      rejectionReason: override ? 'Violence/Injury' : 'None',
      monetizationSafety: override ? 4 : 9,
      advertiserSafety: override ? 3 : 10,
      viralPotential: 8,
      transformationPotential: override ? 4 : 9,
      sourceRisk: override ? 3 : 9,
      editorialAngle: override ? '' : `Insight on how this ${notes ? notes.split(' ')[0] : 'process'} functions.`,
      notes: override ? 'Flagged for keywords (MOCK)' : 'Safe candidate (MOCK)',
      trimStart: 0,
      trimEnd: 30,
      cropPosition: 'center'
    };
  }

  const prompt = `You are a YouTube Shorts content evaluator. Score this candidate clip.
CLIP NOTES: ${notes}
URL: ${url}
STYLE GUIDELINES: ${styleText}

Respond ONLY in valid JSON. Use this structure:
{
  "rejectionOverride": true/false,
  "rejectionReason": "Religion/Adult Content/Violence/Tragedy/Copyright Entertainment/Saturated Repost/Weapons/None",
  "monetizationSafety": 1-10,
  "advertiserSafety": 1-10,
  "viralPotential": 1-10,
  "transformationPotential": 1-10,
  "sourceRisk": 1-10,
  "editorialAngle": "One-line narrative focus explaining what's happening",
  "notes": "Short warning or feedback notes",
  "trimStart": number (suggested start second of raw clip),
  "trimEnd": number (suggested end second of raw clip, keep under 50s total),
  "cropPosition": "center/left/right"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini evaluation returned: ${response.statusText}`);
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

async function performScriptWriting(notes, angle) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const styleText = fs.existsSync(STYLE_PATH) ? fs.readFileSync(STYLE_PATH, 'utf8') : '';

  if (!geminiKey) {
    return {
      script: `This looks simple, but here is what is actually going on. The entire mechanism revolves around ${angle || 'this process'}. Notice how the forces balance as it operates. Every single movement is designed to prevent friction and optimize speed. Follow for more daily breakdowns.`
    };
  }

  const prompt = `Write a narration script for a YouTube Short.
FORMAT: "Narrated Spotlight" — confident, clear narrator providing commentary over a visual clip.
CLIP NOTES: ${notes}
EDITORIAL ANGLE: ${angle}
STYLE GUIDELINES TO FOLLOW EXACTLY:
${styleText}

REQUIREMENTS:
- TRANSLATION CONSTRAINT: If the clip notes, title, or details are in any language other than English, translate them, and write the script 100% in English. The final script output MUST be strictly in English.
- Word count: 80-130 words (target 45 seconds speaking time)
- Hook: Start with a 5-10 word attention-grabbing hook
- Output ONLY the raw spoken text. No timestamps, no directions. Just the words.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini script call returned: ${response.statusText}`);
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  return { script: text.trim() };
}

async function performVoiceSynthesis(script, shortId, voiceId) {
  const elKey = process.env.ELEVENLABS_API_KEY;
  const audioFileName = `${shortId}_voice.mp3`;
  const audioFilePath = path.join(MEDIA_DIR, audioFileName);

  if (!elKey) {
    fs.writeFileSync(audioFilePath, Buffer.from([0x00, 0x00, 0x00])); // Placeholder
    return { success: true, audioUrl: `/media/${audioFileName}`, isMock: true };
  }

  const vId = voiceId || '21m00Tcm4TlvDq8ikWAM'; 
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': elKey
    },
    body: JSON.stringify({
      text: script,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.75, similarity_boost: 0.75 }
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs error: ${await response.text()}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(audioFilePath, Buffer.from(arrayBuffer));
  return { success: true, audioUrl: `/media/${audioFileName}` };
}

// --- Express Route Wrappers calling Helpers ---

// Download Source Clip via yt-dlp
app.post('/api/shorts/:id/download', async (req, res) => {
  try {
    const db = readDb();
    const short = db.shorts.find(s => s.id === req.params.id);
    if (!short) return res.status(404).json({ error: 'Short not found.' });

    await performYtDlpDownload(short.id, short.sourceUrl);
    res.json({ success: true, message: 'Source video downloaded successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stitch Draft Video using FFmpeg
app.post('/api/shorts/:id/render', async (req, res) => {
  try {
    const db = readDb();
    const short = db.shorts.find(s => s.id === req.params.id);
    if (!short) return res.status(404).json({ error: 'Short not found.' });

    const draftUrl = await performFfmpegRender(short, req.body);
    
    // Save output path to short db
    short.finalMp4 = draftUrl;
    writeDb(db);

    res.json({ success: true, draftUrl, message: 'Draft Short stitched successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Safety Audit
app.post('/api/generate-angle', async (req, res) => {
  try {
    const { notes, url } = req.body;
    const evaluation = await performSafetyAudit(notes, url);
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Script Drafting
app.post('/api/generate-script', async (req, res) => {
  try {
    const { notes, angle } = req.body;
    const result = await performScriptWriting(notes, angle);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ElevenLabs Audio Rendering
app.post('/api/generate-voice', async (req, res) => {
  try {
    const { script, shortId, voiceId } = req.body;
    const result = await performVoiceSynthesis(script, shortId, voiceId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Autonomous Production Pipeline Engine ---

// Apify Actor Helper (triggers actor, polls run, retrieves dataset items)
async function runApifyActorAndGetDataset(actorId, token, query, limit) {
  console.log(`[APIFY] Triggering Actor "${actorId}" with query "${query}"...`);
  try {
    const triggerUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`;
    const body = {
      searchQueries: [query],
      resultsLimit: limit,
      hashtags: [query],
      searchLimit: limit
    };

    const response = await fetch(triggerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Apify trigger request returned: ${response.statusText}`);
    }

    const startResult = await response.json();
    const runId = startResult.data.id;
    console.log(`[APIFY] Actor run started. Run ID: ${runId}. Polling status...`);

    // Poll status up to 90 seconds (every 3s)
    let status = 'RUNNING';
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const checkRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        status = checkData.data.status;
        if (status === 'SUCCEEDED' || status === 'FAILED' || status === 'TIMED-OUT' || status === 'ABORTED') {
          break;
        }
      }
    }

    if (status !== 'SUCCEEDED') {
      throw new Error(`Apify Actor run finished with unsuccessful status: ${status}`);
    }

    console.log(`[APIFY] Actor run finished successfully! Downloading dataset...`);
    const datasetRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${token}`);
    if (!datasetRes.ok) {
      throw new Error(`Failed to fetch dataset items for run ${runId}`);
    }

    return await datasetRes.json();
  } catch (err) {
    console.error('[APIFY RUN ERROR]', err);
    throw err;
  }
}

async function runCrawlInternal(config) {
  const { 
    youtubeApiKey,
    instaEndpoint, instaApiKey,
    tiktokEndpoint, tiktokApiKey,
    searchQuery
  } = config;
  const limit = 10;
  const db = readDb();
  let addedCount = 0;

  console.log(`[AUTONOMOUS PIPELINE] Running automated scan across YouTube, Instagram, and TikTok...`);

  // --- 1. YouTube Search API Scraper ---
  if (youtubeApiKey && searchQuery) {
    console.log(`[AUTONOMOUS PIPELINE] Searching YouTube: "${searchQuery}"`);
    try {
      const publishedAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&order=viewCount&publishedAfter=${publishedAfter}&maxResults=${limit}&key=${youtubeApiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        for (const item of items) {
          const sourceUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`;
          if (db.shorts.some(s => s.sourceUrl === sourceUrl)) continue;
          
          const today = new Date();
          const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
          const prefix = `SHORT-${dateStr}`;
          const count = db.shorts.filter(s => s.id.startsWith(prefix)).length + 1;
          const newShort = {
            id: `${prefix}-${count}`,
            status: 'Searching',
            visualTheme: 'YouTube Search',
            sourceUrl,
            sourceNotes: item.snippet.title,
            monetizationSafety: 0, advertiserSafety: 0, viralPotential: 0, transformationPotential: 0, sourceRisk: 0,
            rejectionOverride: false, rejectionReason: '', finalScore: 0.0, editorialAngle: '', script: '', voiceoverAudio: '',
            editGuidelines: '', trimStart: 0, trimEnd: 30, cropPosition: 'center', backgroundMusic: 'none', musicVolume: 10,
            aiStylization: false, finalMp4: '', title: item.snippet.title.substring(0, 60), description: `#shorts #ytsearch ` + item.snippet.title,
            scheduleTime: '', youtubeUrl: '', views48h: 0, createdAt: new Date().toISOString()
          };
          db.shorts.push(newShort);
          addedCount++;
          if (addedCount >= limit) break;
        }
      }
    } catch (err) {
      console.error(`[AUTONOMOUS PIPELINE] YouTube search error:`, err);
    }
  }

  // --- 2. Instagram Scraper API (Apify / Custom URL) ---
  if (instaEndpoint && addedCount < limit) {
    console.log(`[AUTONOMOUS PIPELINE] Ingesting Instagram: "${instaEndpoint}"`);
    try {
      let items = [];
      if (instaEndpoint.startsWith('http://') || instaEndpoint.startsWith('https://')) {
        // Direct Endpoint Fetch
        const headers = instaApiKey ? { 'Authorization': `Bearer ${instaApiKey}` } : {};
        const response = await fetch(instaEndpoint, { headers });
        if (response.ok) {
          const raw = await response.json();
          items = Array.isArray(raw) ? raw : (raw.results || raw.items || []);
        }
      } else if (instaApiKey) {
        // Apify Actor Trigger
        items = await runApifyActorAndGetDataset(instaEndpoint, instaApiKey, searchQuery, limit);
      }

      for (const item of items) {
        const sourceUrl = item.url || item.videoUrl || item.link || item.instagramUrl;
        if (!sourceUrl || db.shorts.some(s => s.sourceUrl === sourceUrl)) continue;
        
        const today = new Date();
        const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
        const prefix = `SHORT-${dateStr}`;
        const count = db.shorts.filter(s => s.id.startsWith(prefix)).length + 1;
        const itemTitle = item.caption || item.title || item.name || 'Instagram Video';
        
        const newShort = {
          id: `${prefix}-${count}`,
          status: 'Searching',
          visualTheme: 'Instagram Scraper',
          sourceUrl,
          sourceNotes: itemTitle,
          monetizationSafety: 0, advertiserSafety: 0, viralPotential: 0, transformationPotential: 0, sourceRisk: 0,
          rejectionOverride: false, rejectionReason: '', finalScore: 0.0, editorialAngle: '', script: '', voiceoverAudio: '',
          editGuidelines: '', trimStart: 0, trimEnd: 30, cropPosition: 'center', backgroundMusic: 'none', musicVolume: 10,
          aiStylization: false, finalMp4: '', title: itemTitle.substring(0, 60), description: `#shorts #instagram ` + itemTitle,
          scheduleTime: '', youtubeUrl: '', views48h: 0, createdAt: new Date().toISOString()
        };
        db.shorts.push(newShort);
        addedCount++;
        if (addedCount >= limit) break;
      }
    } catch (err) {
      console.error(`[AUTONOMOUS PIPELINE] Instagram crawl error:`, err);
    }
  }

  // --- 3. TikTok Scraper API (Apify / Custom URL) ---
  if (tiktokEndpoint && addedCount < limit) {
    console.log(`[AUTONOMOUS PIPELINE] Ingesting TikTok: "${tiktokEndpoint}"`);
    try {
      let items = [];
      if (tiktokEndpoint.startsWith('http://') || tiktokEndpoint.startsWith('https://')) {
        // Direct Endpoint Fetch
        const headers = tiktokApiKey ? { 'Authorization': `Bearer ${tiktokApiKey}` } : {};
        const response = await fetch(tiktokEndpoint, { headers });
        if (response.ok) {
          const raw = await response.json();
          items = Array.isArray(raw) ? raw : (raw.results || raw.items || []);
        }
      } else if (tiktokApiKey) {
        // Apify Actor Trigger
        items = await runApifyActorAndGetDataset(tiktokEndpoint, tiktokApiKey, searchQuery, limit);
      }

      for (const item of items) {
        const sourceUrl = item.url || item.videoUrl || item.link || item.tiktokUrl;
        if (!sourceUrl || db.shorts.some(s => s.sourceUrl === sourceUrl)) continue;
        
        const today = new Date();
        const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
        const prefix = `SHORT-${dateStr}`;
        const count = db.shorts.filter(s => s.id.startsWith(prefix)).length + 1;
        const itemTitle = item.desc || item.title || item.name || 'TikTok Video';
        
        const newShort = {
          id: `${prefix}-${count}`,
          status: 'Searching',
          visualTheme: 'TikTok Scraper',
          sourceUrl,
          sourceNotes: itemTitle,
          monetizationSafety: 0, advertiserSafety: 0, viralPotential: 0, transformationPotential: 0, sourceRisk: 0,
          rejectionOverride: false, rejectionReason: '', finalScore: 0.0, editorialAngle: '', script: '', voiceoverAudio: '',
          editGuidelines: '', trimStart: 0, trimEnd: 30, cropPosition: 'center', backgroundMusic: 'none', musicVolume: 10,
          aiStylization: false, finalMp4: '', title: itemTitle.substring(0, 60), description: `#shorts #tiktok ` + itemTitle,
          scheduleTime: '', youtubeUrl: '', views48h: 0, createdAt: new Date().toISOString()
        };
        db.shorts.push(newShort);
        addedCount++;
        if (addedCount >= limit) break;
      }
    } catch (err) {
      console.error(`[AUTONOMOUS PIPELINE] TikTok crawl error:`, err);
    }
  }

  if (addedCount > 0) {
    writeDb(db);
    console.log(`[AUTONOMOUS PIPELINE] Added ${addedCount} new candidate videos across platforms.`);
  } else {
    console.log(`[AUTONOMOUS PIPELINE] No new candidate videos added.`);
  }
  return addedCount;
}

async function triggerAutonomousRun(config) {
  console.log('[AUTONOMOUS PIPELINE] Triggering crawling session...');
  
  // 1. Run discovery crawl to pull fresh clips if configured
  await runCrawlInternal(config);
  
  // 2. Select the first Candidate
  const db = readDb();
  let candidate = db.shorts.find(s => s.status === 'Searching');
  if (!candidate) {
    throw new Error('No candidate videos available for editing after scraping.');
  }

  console.log(`[AUTONOMOUS PIPELINE] Selected Candidate: ${candidate.id} (${candidate.sourceNotes})`);

  // 3. Score and Eval via Gemini
  console.log('[AUTONOMOUS PIPELINE] Scoring safety and parameters with Gemini...');
  const evalResult = await performSafetyAudit(candidate.sourceNotes, candidate.sourceUrl);
  candidate.monetizationSafety = evalResult.monetizationSafety;
  candidate.advertiserSafety = evalResult.advertiserSafety;
  candidate.viralPotential = evalResult.viralPotential;
  candidate.transformationPotential = evalResult.transformationPotential;
  candidate.sourceRisk = evalResult.sourceRisk;
  candidate.rejectionOverride = evalResult.rejectionOverride;
  candidate.rejectionReason = evalResult.rejectionReason;
  candidate.editorialAngle = evalResult.editorialAngle || 'Focus analysis on target process.';
  candidate.trimStart = evalResult.trimStart || 0;
  candidate.trimEnd = evalResult.trimEnd || 30;
  candidate.cropPosition = evalResult.cropPosition || 'center';

  if (candidate.rejectionOverride) {
    candidate.status = 'Rejected';
    writeDb(db);
    console.warn(`[AUTONOMOUS PIPELINE] Candidate ${candidate.id} REJECTED due to safety audit.`);
    return { success: false, reason: `Rejected: ${candidate.rejectionReason}` };
  }

  // 4. Generate Script
  console.log('[AUTONOMOUS PIPELINE] Writing narrator script with Gemini...');
  const scriptResult = await performScriptWriting(candidate.sourceNotes, candidate.editorialAngle);
  candidate.script = scriptResult.script;

  // 5. Generate Voice
  console.log('[AUTONOMOUS PIPELINE] Synthesizing narrator voiceover in ElevenLabs...');
  const voiceResult = await performVoiceSynthesis(candidate.script, candidate.id, config.defaultVoiceId);
  candidate.voiceoverAudio = voiceResult.audioUrl;

  // Save intermediate state
  candidate.status = 'Processing';
  writeDb(db);

  // 6. Download raw clip
  console.log('[AUTONOMOUS PIPELINE] Downloading raw video file...');
  await performYtDlpDownload(candidate.id, candidate.sourceUrl);

  // 7. Render compilation in FFmpeg — AI picks music track and volume automatically
  console.log('[AUTONOMOUS PIPELINE] Mixing and compiling vertical draft short in FFmpeg...');

  const settings = {
    trimStart: candidate.trimStart,
    trimEnd: candidate.trimEnd,
    cropPosition: candidate.cropPosition,
    backgroundMusic: 'auto',   // AI picks a random track from the music library
    musicVolume: null,          // AI sets a tasteful default volume (12%)
    aiStylization: true
  };

  const draftUrl = await performFfmpegRender(candidate, settings);
  
  // Save final state
  const finalDb = readDb();
  const finalShort = finalDb.shorts.find(s => s.id === candidate.id);
  finalShort.status = 'Uploaded';
  finalShort.finalMp4 = draftUrl;
  writeDb(finalDb);

  console.log(`[AUTONOMOUS PIPELINE] Autonomous run finished successfully. Final output: ${draftUrl}`);
  return { success: true, shortId: candidate.id, videoUrl: draftUrl };
}

// Manual trigger route
app.post('/api/trigger-autonomous-run', async (req, res) => {
  try {
    let config = {
      provider: 'reddit',
      endpointUrl: '',
      apiKey: '',
      searchQuery: 'satisfying, specializedtools',
      minScore: 1000,
      maxResults: 5,
      defaultVoiceId: '21m00Tcm4TlvDq8ikWAM',
      defaultMusic: 'random',
      defaultMusicVolume: 12
    };

    if (fs.existsSync(DISCOVERY_CONFIG_PATH)) {
      config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));
    }

    const result = await triggerAutonomousRun(config);
    res.json({ success: true, message: 'Autonomous pipeline run completed successfully!', result });
  } catch (error) {
    console.error('[AUTONOMOUS RUN ERROR] Failed:', error);
    res.status(500).json({ error: error.message || 'Autonomous pipeline execution failed.' });
  }
});

// Background loop (check every 30 seconds)
setInterval(() => {
  try {
    if (!fs.existsSync(DISCOVERY_CONFIG_PATH)) return;
    const config = JSON.parse(fs.readFileSync(DISCOVERY_CONFIG_PATH, 'utf8'));

    if (config.autoPipelineEnabled) {
      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD

      // Trigger if time matches and not executed today
      if (currentHourMin === config.dailyTime && config.lastAutoRunDate !== currentDateStr) {
        console.log(`[AUTONOMOUS RUN TIMER] Daily execution triggered at ${currentHourMin}`);
        config.lastAutoRunDate = currentDateStr;
        fs.writeFileSync(DISCOVERY_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');

        triggerAutonomousRun(config).catch(err => {
          console.error('[AUTONOMOUS RUN TIMER] Failed:', err);
        });
      }
    }
  } catch (err) {
    console.error('[AUTONOMOUS RUN TIMER] Background loop error:', err);
  }
}, 30000);

// Serve assets
app.use('/media/music', express.static(MUSIC_DIR));
app.use('/media/sfx', express.static(SFX_DIR));
app.use('/media/assets', express.static(ASSETS_DIR));

app.get('/media/:filename', (req, res) => {
  const filePath = path.join(MEDIA_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Shorts Production Dashboard running locally!`);
  console.log(`👉 Access URL: http://localhost:${PORT}`);
  console.log(`==================================================`);
});

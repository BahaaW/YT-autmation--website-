// app.js — YT Shorts Production Dashboard Controller

// Application State
let shorts = [];
let activeShort = null;
let currentTabFilter = 'all';

// DOM Elements Mapping
const elements = {
  // Config Drawer triggers
  btnOpenConfig: document.getElementById('btn-open-config'),
  btnCloseConfig: document.getElementById('btn-close-config'),
  configDrawer: document.getElementById('config-drawer'),
  configDrawerOverlay: document.getElementById('config-drawer-overlay'),

  // Manual Edit Modal Overlay
  editModalOverlay: document.getElementById('edit-modal-overlay'),
  btnCloseEditModal: document.getElementById('btn-close-edit-modal'),

  // Quick Ingest form
  quickAddForm: document.getElementById('quick-add-form'),
  quickSourceUrl: document.getElementById('quickSourceUrl'),

  // Queue Tabs & List
  tabBtns: document.querySelectorAll('.queue-tabs .tab-btn'),
  queueList: document.getElementById('queue-list'),

  // Scheduler Giant Start button
  schedulerStatusText: document.getElementById('scheduler-status-text'),
  btnTriggerAutonomousGiant: document.getElementById('btn-trigger-autonomous-giant'),

  // System Progress indicators
  engineStatusBadge: document.getElementById('engine-status-badge'),
  activeProgressBarGroup: document.getElementById('active-progress-bar-group'),
  activeProgressFill: document.getElementById('active-progress-fill'),
  consoleLog: document.getElementById('console-log-box'),

  // Active Short Fields (Inside Modal)
  activeId: document.getElementById('active-id'),
  activeThemeBadge: document.getElementById('active-theme-badge'),
  activeSourceLink: document.getElementById('active-source-link'),
  activeStatus: document.getElementById('active-status'),
  activeNotes: document.getElementById('active-notes'),
  activeAngle: document.getElementById('active-angle'),
  activeScript: document.getElementById('active-script'),
  wordCount: document.getElementById('script-word-count'),
  durationCount: document.getElementById('script-duration-count'),
  
  // Metadata & Schedule (Inside Modal)
  activeTitle: document.getElementById('active-title'),
  activeDescription: document.getElementById('active-description'),
  activeSchedule: document.getElementById('active-schedule'),
  activeYoutubeUrl: document.getElementById('active-youtube-url'),

  // Scoring Sliders & Outcomes (Inside Modal)
  slideMonetization: document.getElementById('slide-monetization'),
  slideAdvertiser: document.getElementById('slide-advertiser'),
  slideViral: document.getElementById('slide-viral'),
  slideTransformation: document.getElementById('slide-transformation'),
  slideSource: document.getElementById('slide-source'),
  valMonetization: document.getElementById('val-monetization'),
  valAdvertiser: document.getElementById('val-advertiser'),
  valViral: document.getElementById('val-viral'),
  valTransformation: document.getElementById('val-transformation'),
  valSource: document.getElementById('val-source'),
  overrideRejection: document.getElementById('override-rejection'),

  // AI Buttons & Log (Inside Modal)
  btnGenAngle: document.getElementById('btn-generate-angle'),
  btnGenScript: document.getElementById('btn-generate-script'),
  btnGenVoice: document.getElementById('btn-generate-voice'),
  voicePlayer: document.getElementById('voice-player'),

  // Buttons (Inside Modal)
  btnSaveShort: document.getElementById('btn-save-short'),
  btnDeleteShort: document.getElementById('btn-delete-short'),

  // Video Placeholder & Players
  videoPlaceholder: document.getElementById('video-placeholder'),
  draftVideoPanel: document.getElementById('draft-video-panel'),
  draftPlayer: document.getElementById('draft-player'),

  // Discovery Configuration (Platform APIs)
  discoveryYtKey: document.getElementById('discovery-yt-key'),
  discoveryInstaEndpoint: document.getElementById('discovery-insta-endpoint'),
  discoveryInstaKey: document.getElementById('discovery-insta-key'),
  discoveryTiktokEndpoint: document.getElementById('discovery-tiktok-endpoint'),
  discoveryTiktokKey: document.getElementById('discovery-tiktok-key'),
  discoveryQuery: document.getElementById('discovery-query'),
  btnSaveDiscoveryConfig: document.getElementById('btn-save-discovery-config'),

  // Autonomous Scheduler Configuration (Slide out Drawer)
  autoPipelineEnabled: document.getElementById('auto-pipeline-enabled'),
  autoDailyTime: document.getElementById('auto-daily-time'),
  autoDefaultVoice: document.getElementById('auto-default-voice'),
  autoDefaultMusic: document.getElementById('auto-default-music'),
  autoMusicVolume: document.getElementById('auto-music-volume'),

  // Style guidelines
  styleEditor: document.getElementById('style-editor'),

  // Render Settings
  renderCrop: document.getElementById('render-crop'),
  renderTrimStart: document.getElementById('render-trim-start'),
  renderTrimEnd: document.getElementById('render-trim-end'),
  renderMusic: document.getElementById('render-music'),
  renderMusicVolume: document.getElementById('render-music-volume'),
  musicVolLabel: document.getElementById('music-vol-label'),
  renderAiStyle: document.getElementById('render-ai-style'),
  btnDownloadSource: document.getElementById('btn-download-source'),
  btnRenderDraft: document.getElementById('btn-render-draft'),

  // YouTube OAuth Credentials
  discoveryYtClientId: document.getElementById('discovery-yt-client-id'),
  discoveryYtClientSecret: document.getElementById('discovery-yt-client-secret'),
  btnYtAuth: document.getElementById('btn-yt-auth'),
  ytAuthStatus: document.getElementById('yt-auth-status'),
  btnYtUploadVideo: document.getElementById('btn-yt-upload-video'),

  // Music Library Manager
  musicLibraryList: document.getElementById('music-library-list'),
  musicLibraryUpload: document.getElementById('music-library-upload'),
  btnMusicUpload: document.getElementById('btn-music-upload'),

  // SFX Library Manager
  sfxLibraryList: document.getElementById('sfx-library-list'),
  sfxLibraryUpload: document.getElementById('sfx-library-upload'),
  btnSfxUpload: document.getElementById('btn-sfx-upload'),
  renderSfx: document.getElementById('render-sfx'),

  // Quick Preview modal
  previewVideoModal: document.getElementById('preview-video-modal'),
  quickPreviewPlayer: document.getElementById('quick-preview-player'),
  btnCloseQuickPreview: document.getElementById('btn-close-quick-preview'),
  quickPreviewTitle: document.getElementById('quick-preview-title'),

  // Notification
  toast: document.getElementById('toast')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  fetchShorts();
  setupEventListeners();
  loadStyleGuidelines();
  loadDiscoveryConfig();
  loadMusicLibrary();
  loadSfxLibrary();
});

// --- API Calls ---

// Load all Shorts from DB
async function fetchShorts() {
  try {
    const response = await fetch('/api/shorts');
    shorts = await response.json();
    renderQueueList();
    if (activeShort) {
      const fresh = shorts.find(s => s.id === activeShort.id);
      if (fresh) {
        selectShort(fresh);
      }
    }
  } catch (error) {
    console.error('Error fetching shorts:', error);
    logConsole('Error connecting to local backend server.');
  }
}

// Set up UI Event Listeners
function setupEventListeners() {
  // 1. Drawer open/close toggles
  elements.btnOpenConfig.addEventListener('click', () => {
    elements.configDrawer.classList.add('open');
    elements.configDrawerOverlay.style.display = 'block';
  });

  const closeDrawer = () => {
    elements.configDrawer.classList.remove('open');
    elements.configDrawerOverlay.style.display = 'none';
  };
  elements.btnCloseConfig.addEventListener('click', closeDrawer);
  elements.configDrawerOverlay.addEventListener('click', closeDrawer);

  // 2. Edit Modal close toggle
  elements.btnCloseEditModal.addEventListener('click', () => {
    elements.editModalOverlay.style.display = 'none';
    elements.voicePlayer.pause();
    elements.draftPlayer.pause();
  });

  // 3. Quick Ingest Submit
  elements.quickAddForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const sourceUrl = elements.quickSourceUrl.value;
    try {
      const response = await fetch('/api/shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl, sourceNotes: 'Manually Ingested Link', visualTheme: 'Manual' })
      });
      const newShort = await response.json();
      showToast('Video added to queue!');
      elements.quickSourceUrl.value = '';
      await fetchShorts();
      selectShort(newShort);
    } catch (error) {
      console.error('Error adding clip:', error);
      showToast('Failed to add clip');
    }
  });

  // 4. Queue Tab Filters
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTabFilter = btn.dataset.filter;
      renderQueueList();
    });
  });

  // 5. Slider Scoring Listeners
  const sliders = [
    { input: elements.slideMonetization, val: elements.valMonetization },
    { input: elements.slideAdvertiser, val: elements.valAdvertiser },
    { input: elements.slideViral, val: elements.valViral },
    { input: elements.slideTransformation, val: elements.valTransformation },
    { input: elements.slideSource, val: elements.valSource }
  ];

  sliders.forEach(pair => {
    pair.input.addEventListener('input', () => {
      pair.val.textContent = pair.input.value;
      calculateScoreLive();
    });
  });

  // 6. Script Word Counter
  elements.activeScript.addEventListener('input', updateWordCounter);

  // 7. Save Active Short Changes
  elements.btnSaveShort.addEventListener('click', async () => {
    await saveActiveShortChanges();
    elements.editModalOverlay.style.display = 'none';
  });

  // 8. Delete Active Short
  elements.btnDeleteShort.addEventListener('click', deleteActiveShort);

  // 9. AI Generation Pipeline triggers
  elements.btnGenAngle.addEventListener('click', runAngleEvaluation);
  elements.btnGenScript.addEventListener('click', runScriptDrafting);
  elements.btnGenVoice.addEventListener('click', runVoiceGeneration);

  // 10. Configurations Save Event (Drawer)
  elements.btnSaveDiscoveryConfig.addEventListener('click', saveDiscoveryConfig);

  // 11. Scheduler Manual Trigger Event (Giant Button)
  elements.btnTriggerAutonomousGiant.addEventListener('click', triggerAutonomousPipelineRun);

  // 12. Music Volume Label Update
  elements.renderMusicVolume.addEventListener('input', () => {
    elements.musicVolLabel.textContent = elements.renderMusicVolume.value;
  });

  // 12b. Show/hide volume slider when music choice changes
  elements.renderMusic.addEventListener('change', () => {
    const isAuto = elements.renderMusic.value === 'auto';
    const volGroup = document.getElementById('music-volume-group');
    if (volGroup) volGroup.style.display = isAuto ? 'none' : '';
  });

  // 13. Download Video Event
  elements.btnDownloadSource.addEventListener('click', downloadSourceVideo);

  // 14. Render Video Event
  elements.btnRenderDraft.addEventListener('click', renderVideoDraft);

  // 15. YouTube Direct Upload Button
  elements.btnYtUploadVideo.addEventListener('click', uploadActiveShortToYouTube);

  // 16. YouTube OAuth Auth Button
  elements.btnYtAuth.addEventListener('click', startYouTubeOAuthFlow);

  // 17. Music Library Upload Trigger
  elements.btnMusicUpload.addEventListener('click', uploadBackingTrackToLibrary);

  // 18. SFX Library Upload Trigger
  elements.btnSfxUpload.addEventListener('click', uploadSfxToLibrary);

  // 19. Quick Preview Modal Close Button
  elements.btnCloseQuickPreview.addEventListener('click', () => {
    elements.previewVideoModal.style.display = 'none';
    elements.quickPreviewPlayer.pause();
    elements.quickPreviewPlayer.src = '';
  });
}

// --- List Rendering ---

function renderQueueList() {
  elements.queueList.innerHTML = '';
  
  let filtered = shorts;
  if (currentTabFilter === 'active') {
    filtered = shorts.filter(s => s.status === 'Searching' || s.status === 'Processing');
  } else if (currentTabFilter === 'done') {
    filtered = shorts.filter(s => s.status === 'Uploaded');
  }

  if (filtered.length === 0) {
    elements.queueList.innerHTML = '<div class="empty-state">No videos found</div>';
    return;
  }

  // Sort: newest first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = `short-card ${activeShort && activeShort.id === item.id ? 'active' : ''}`;
    
    // Status color class
    let statusClass = 'status-candidate';
    if (item.status === 'Rejected') statusClass = 'status-rejected';
    else if (item.status === 'Uploaded') statusClass = 'status-rendered';
    else if (item.status === 'Processing') statusClass = 'status-progress';
    else if (item.status === 'Searching') statusClass = 'status-candidate';

    card.innerHTML = `
      <div class="card-info">
        <span class="card-title">${item.sourceNotes || 'Untitled Video'}</span>
        <div class="card-meta">
          <span>ID: ${item.id}</span> • 
          <span>Source: ${item.visualTheme || 'Manual'}</span>
        </div>
        <div class="card-quick-actions" style="display: flex; gap: 8px; margin-top: 8px; pointer-events: auto;">
          <button class="quick-action-btn quick-preview-btn" title="Quick Play Draft" style="background: #2563eb; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600; display: ${item.finalMp4 ? 'inline-block' : 'none'};">🎬 Play</button>
          <button class="quick-action-btn quick-status-btn" title="Toggle Status Done/Candidate" style="background: #10b981; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;">✓ Done</button>
          <button class="quick-action-btn quick-delete-btn" title="Delete Video" style="background: #ef4444; color: white; border: none; padding: 3px 8px; border-radius: 4px; font-size: 10px; cursor: pointer; font-weight: 600;">🗑 Delete</button>
        </div>
      </div>
      <span class="status-badge ${statusClass}">${item.status}</span>
    `;

    // Click on buttons shouldn't trigger parent card select click
    card.querySelector('.quick-preview-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickPreview(item);
    });
    card.querySelector('.quick-status-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      await toggleShortStatusQuick(item);
    });
    card.querySelector('.quick-delete-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`Delete video candidate "${item.id}"?`)) {
        await deleteShortQuick(item.id);
      }
    });

    card.addEventListener('click', () => selectShort(item));
    elements.queueList.appendChild(card);
  });
}

// --- Active Workspace Management ---

function selectShort(short) {
  activeShort = short;
  
  // Highlight card in list
  document.querySelectorAll('.short-card').forEach(c => c.classList.remove('active'));
  
  // Show tweaking overlay modal
  elements.editModalOverlay.style.display = 'flex';

  // Load details fields
  elements.activeId.textContent = short.id;
  elements.activeThemeBadge.textContent = short.visualTheme;
  elements.activeSourceLink.href = short.sourceUrl;
  elements.activeSourceLink.textContent = `Original Link (${short.sourceUrl.substring(0, 32)}...) ↗`;
  elements.activeStatus.value = short.status;
  elements.activeNotes.value = short.sourceNotes || '';
  elements.activeAngle.value = short.editorialAngle || '';
  elements.activeScript.value = short.script || '';
  elements.activeTitle.value = short.title || '';
  elements.activeDescription.value = short.description || '';
  elements.activeSchedule.value = short.scheduleTime || '';
  elements.activeYoutubeUrl.value = short.youtubeUrl || '';

  // Load scores
  elements.slideMonetization.value = short.monetizationSafety || 10;
  elements.valMonetization.textContent = short.monetizationSafety || 10;
  elements.slideAdvertiser.value = short.advertiserSafety || 10;
  elements.valAdvertiser.textContent = short.advertiserSafety || 10;
  elements.slideViral.value = short.viralPotential || 8;
  elements.valViral.textContent = short.viralPotential || 8;
  elements.slideTransformation.value = short.transformationPotential || 9;
  elements.valTransformation.textContent = short.transformationPotential || 9;
  elements.slideSource.value = short.sourceRisk || 2;
  elements.valSource.textContent = short.sourceRisk || 2;

  // Override box
  elements.overrideRejection.checked = short.rejectionOverride || false;

  updateWordCounter();
  updateVideoPreview(short.sourceUrl);

  // Load Audio
  if (short.voiceoverAudio) {
    elements.voicePlayer.style.display = 'block';
    elements.voicePlayer.src = short.voiceoverAudio;
    elements.voicePlayer.load();
  } else {
    elements.voicePlayer.style.display = 'none';
    elements.voicePlayer.src = '';
  }

  // Load Render Settings
  elements.renderCrop.value = short.cropPosition || 'center';
  elements.renderTrimStart.value = short.trimStart !== undefined ? short.trimStart : 0;
  elements.renderTrimEnd.value = short.trimEnd !== undefined ? short.trimEnd : 30;
  elements.renderMusic.value = short.backgroundMusic || 'none';
  elements.renderMusicVolume.value = short.musicVolume !== undefined ? short.musicVolume : 10;
  elements.musicVolLabel.textContent = elements.renderMusicVolume.value;
  elements.renderAiStyle.checked = short.aiStylization || false;

  // Load Rendered Video Draft Player
  if (short.finalMp4) {
    elements.draftVideoPanel.style.display = 'block';
    elements.draftPlayer.src = short.finalMp4;
    elements.draftPlayer.load();
  } else {
    elements.draftVideoPanel.style.display = 'none';
    elements.draftPlayer.src = '';
  }

  // Show upload to YT button if video is finished rendering but not uploaded yet
  if (short.status === 'Uploaded' && !short.youtubeUrl) {
    elements.btnYtUploadVideo.style.display = 'inline-block';
  } else {
    elements.btnYtUploadVideo.style.display = 'none';
  }

  // Populate read-only summary card
  updateSummaryDetails(short);
}

function updateSummaryDetails(short) {
  // 1. YouTube Link
  const ytLink = document.getElementById('summary-yt-link');
  if (short.youtubeUrl) {
    ytLink.innerHTML = `<a href="${short.youtubeUrl}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: underline;">Open Short link ↗</a>`;
  } else {
    ytLink.innerHTML = `<span style="color: #64748b;">Not uploaded (Status: ${short.status})</span>`;
  }

  // 2. Voice details
  const voice = document.getElementById('summary-voice-details');
  if (short.voiceoverAudio) {
    const text = short.script || '';
    const wordCount = text ? text.split(/\s+/).length : 0;
    const duration = Math.ceil((wordCount / 150) * 60);
    voice.innerHTML = `<span style="color: #166534; font-weight: 500;">✓ ElevenLabs Active</span><br><span style="color: #64748b; font-size: 11px;">${wordCount} words, ~${duration}s</span>`;
  } else {
    voice.innerHTML = `<span style="color: #ef4444; font-weight: 500;">✗ Voice not rendered</span>`;
  }

  // 3. Edit actions
  const edit = document.getElementById('summary-edit-actions');
  const crop = short.cropPosition || 'center';
  const start = short.trimStart !== undefined ? short.trimStart : 0;
  const end = short.trimEnd !== undefined ? short.trimEnd : 30;
  const music = short.backgroundMusic || 'none';
  const volume = short.musicVolume !== undefined ? short.musicVolume : 10;
  const style = short.aiStylization ? 'Cyberpunk' : 'Standard';
  edit.innerHTML = `<span style="color: #1f2937; font-weight: 500;">Crop: ${crop} | Trim: ${start}s-${end}s</span><br><span style="color: #64748b; font-size: 11px;">Music: ${music} (${volume}%), Grade: ${style}</span>`;

  // 4. Safety
  const safety = document.getElementById('summary-safety-score');
  const finalScore = short.finalScore !== undefined ? short.finalScore : 0;
  if (finalScore > 0) {
    let scoreColor = '#10b981';
    if (finalScore < 6.0) scoreColor = '#ef4444';
    else if (finalScore < 7.5) scoreColor = '#f59e0b';
    safety.innerHTML = `<span style="font-weight: 700; color: ${scoreColor}; font-size: 14px;">${finalScore.toFixed(1)} / 10</span><br><span style="color: #64748b; font-size: 11px;">Mon: ${short.monetizationSafety}, Adv: ${short.advertiserSafety}, Risk: ${short.sourceRisk}</span>`;
  } else {
    safety.innerHTML = `<span style="color: #64748b;">Not evaluated yet</span>`;
  }
}

// Video Embed Helper
function updateVideoPreview(url) {
  if (!url) {
    elements.videoPlaceholder.innerHTML = 'No original video URL loaded.';
    return;
  }

  let videoId = '';
  if (url.includes('/shorts/')) {
    const parts = url.split('/shorts/');
    if (parts[1]) videoId = parts[1].split(/[?#]/)[0];
  } else if (url.includes('v=')) {
    const parts = url.split('v=');
    if (parts[1]) videoId = parts[1].split(/[&?#]/)[0];
  } else if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1]) videoId = parts[1].split(/[?#]/)[0];
  }

  if (videoId) {
    elements.videoPlaceholder.innerHTML = `<iframe style="width: 100%; height: 100%; border: none; border-radius: 6px;" src="https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1" allowfullscreen></iframe>`;
  } else {
    elements.videoPlaceholder.innerHTML = `<div style="text-align: center; color: #64748b;">Source URL is not embeddable directly.<br><a href="${url}" target="_blank" style="color: #3b82f6; font-size: 13px;">Click here to watch on source site ↗</a></div>`;
  }
}

function calculateScoreLive() {
  if (!activeShort) return;
  const mon = parseInt(elements.slideMonetization.value);
  const adv = parseInt(elements.slideAdvertiser.value);
  const vir = parseInt(elements.slideViral.value);
  const trn = parseInt(elements.slideTransformation.value);
  const src = parseInt(elements.slideSource.value);
  
  let score = (mon * 0.30) + (adv * 0.25) + (vir * 0.20) + (trn * 0.15) + (src * 0.10);
  activeShort.finalScore = parseFloat(score.toFixed(2));
}

function updateWordCounter() {
  const text = elements.activeScript.value.trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  elements.wordCount.textContent = wordCount;
  
  // Speak time estimation at 150 WPM
  const seconds = Math.ceil((wordCount / 150) * 60);
  elements.durationCount.textContent = seconds;
}

// --- CRUD Actions ---

async function saveActiveShortChanges() {
  if (!activeShort) return;

  const data = {
    status: elements.activeStatus.value,
    sourceNotes: elements.activeNotes.value,
    editorialAngle: elements.activeAngle.value,
    script: elements.activeScript.value,
    title: elements.activeTitle.value,
    description: elements.activeDescription.value,
    scheduleTime: elements.activeSchedule.value,
    youtubeUrl: elements.activeYoutubeUrl.value,
    
    // Scores
    monetizationSafety: parseInt(elements.slideMonetization.value),
    advertiserSafety: parseInt(elements.slideAdvertiser.value),
    viralPotential: parseInt(elements.slideViral.value),
    transformationPotential: parseInt(elements.slideTransformation.value),
    sourceRisk: parseInt(elements.slideSource.value),
    rejectionOverride: elements.overrideRejection.checked,
    rejectionReason: elements.overrideRejection.checked ? 'Override enabled' : ''
  };

  try {
    const response = await fetch(`/api/shorts/${activeShort.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const updated = await response.json();
    showToast('Changes Saved!');
    await fetchShorts();
    selectShort(updated);
  } catch (error) {
    console.error('Error saving short:', error);
    showToast('Failed to save changes');
  }
}

async function deleteActiveShort() {
  if (!activeShort) return;
  if (!confirm(`Are you sure you want to delete ${activeShort.id}?`)) return;

  try {
    await fetch(`/api/shorts/${activeShort.id}`, { method: 'DELETE' });
    showToast('Video Deleted');
    activeShort = null;
    elements.editModalOverlay.style.display = 'none';
    fetchShorts();
  } catch (error) {
    console.error('Error deleting short:', error);
    showToast('Failed to delete video');
  }
}

// --- AI Automation Tools ---

async function runAngleEvaluation() {
  if (!activeShort) return;
  
  logConsole('Running Gemini Rejection & Safety Filter...');
  elements.btnGenAngle.disabled = true;

  try {
    const response = await fetch('/api/generate-angle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: elements.activeNotes.value, url: activeShort.sourceUrl })
    });
    const result = await response.json();
    
    elements.slideMonetization.value = result.monetizationSafety;
    elements.valMonetization.textContent = result.monetizationSafety;
    elements.slideAdvertiser.value = result.advertiserSafety;
    elements.valAdvertiser.textContent = result.advertiserSafety;
    elements.slideViral.value = result.viralPotential;
    elements.valViral.textContent = result.viralPotential;
    elements.slideTransformation.value = result.transformationPotential;
    elements.valTransformation.textContent = result.transformationPotential;
    elements.slideSource.value = result.sourceRisk;
    elements.valSource.textContent = result.sourceRisk;
    elements.overrideRejection.checked = result.rejectionOverride;
    elements.activeAngle.value = result.editorialAngle || '';

    calculateScoreLive();
    logConsole(`Safety check completed. Outcome: ${result.rejectionOverride ? 'REJECT' : 'PASS'}`);
    await saveActiveShortChanges();
  } catch (error) {
    console.error('Error generating evaluation:', error);
    logConsole('Gemini safety audit failed.');
  } finally {
    elements.btnGenAngle.disabled = false;
  }
}

async function runScriptDrafting() {
  if (!activeShort) return;

  logConsole('Drafting voiceover script via Gemini...');
  elements.btnGenScript.disabled = true;

  try {
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: elements.activeNotes.value, angle: elements.activeAngle.value })
    });
    const result = await response.json();

    elements.activeScript.value = result.script;
    updateWordCounter();
    logConsole('Script written! Tweak if needed, then render voiceover.');
    await saveActiveShortChanges();
  } catch (error) {
    console.error('Error generating script:', error);
    logConsole('Gemini script drafting failed.');
  } finally {
    elements.btnGenScript.disabled = false;
  }
}

async function runVoiceGeneration() {
  if (!activeShort || !elements.activeScript.value) return;

  logConsole('Rendering AI voiceover via ElevenLabs API...');
  elements.btnGenVoice.disabled = true;

  try {
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: elements.activeScript.value, shortId: activeShort.id })
    });
    const result = await response.json();

    if (result.success) {
      elements.voicePlayer.style.display = 'block';
      elements.voicePlayer.src = result.audioUrl;
      elements.voicePlayer.load();
      logConsole('ElevenLabs voiceover rendered successfully!');
      await saveActiveShortChanges();
    } else {
      logConsole(`Voice generation warning: ${result.error}`);
    }
  } catch (error) {
    console.error('Error rendering voiceover:', error);
    logConsole('ElevenLabs API call failed.');
  } finally {
    elements.btnGenVoice.disabled = false;
  }
}

// --- Background Download & FFmpeg Rendering ---

async function downloadSourceVideo() {
  if (!activeShort) return;
  logConsole(`Initializing download for: ${activeShort.id}...`);
  elements.btnDownloadSource.disabled = true;

  try {
    const response = await fetch(`/api/shorts/${activeShort.id}/download`, { method: 'POST' });
    const result = await response.json();
    if (result.success) {
      showToast('Source clip downloaded!');
      logConsole(`yt-dlp successfully completed download for ${activeShort.id}`);
      await fetchShorts();
    } else {
      logConsole(`Download failed: ${result.error}`);
      showToast('Download failed');
    }
  } catch (error) {
    console.error('Download failed:', error);
    logConsole('Download request failed.');
  } finally {
    elements.btnDownloadSource.disabled = false;
  }
}

async function renderVideoDraft() {
  if (!activeShort) return;
  logConsole(`Preparing FFmpeg rendering for ${activeShort.id}...`);
  elements.btnRenderDraft.disabled = true;

  const chosenMusic = elements.renderMusic.value || 'auto';
  const chosenSfx = elements.renderSfx ? (elements.renderSfx.value || 'none') : 'none';
  const data = {
    trimStart: parseFloat(elements.renderTrimStart.value) || 0,
    trimEnd: parseFloat(elements.renderTrimEnd.value) || 30,
    cropPosition: elements.renderCrop.value || 'center',
    backgroundMusic: chosenMusic,
    musicVolume: chosenMusic === 'auto' ? null : (parseInt(elements.renderMusicVolume.value) || 10),
    soundEffect: chosenSfx,
    aiStylization: elements.renderAiStyle.checked || false
  };

  elements.btnRenderDraft.textContent = 'Rendering (0%)...';

  // Start progress percentage polling
  let progressInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/shorts/${activeShort.id}/render-progress`);
      if (res.ok) {
        const pData = await res.json();
        const pct = pData.progress;
        if (pct >= 0) {
          elements.btnRenderDraft.textContent = `Rendering (${pct}%)...`;
        } else {
          elements.btnRenderDraft.textContent = `Render Failed!`;
        }
      }
    } catch (err) {
      console.error('Error polling render progress:', err);
    }
  }, 1000);

  try {
    const response = await fetch(`/api/shorts/${activeShort.id}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.success) {
      showToast('Video Stitched successfully!');
      logConsole(`FFmpeg stitched draft clip at: ${result.videoUrl}`);
      
      elements.draftVideoPanel.style.display = 'block';
      elements.draftPlayer.src = result.videoUrl;
      elements.draftPlayer.load();
      await fetchShorts();
    } else {
      logConsole(`Rendering warning: ${result.error}`);
      showToast('Render failed');
    }
  } catch (error) {
    console.error('Rendering failed:', error);
    logConsole('Render request failed.');
  } finally {
    clearInterval(progressInterval);
    elements.btnRenderDraft.disabled = false;
    elements.btnRenderDraft.textContent = 'Stitch Draft Short';
  }
}

// --- Save config from settings drawer ---

async function saveDiscoveryConfig() {
  const config = {
    youtubeApiKey: elements.discoveryYtKey.value,
    youtubeClientId: elements.discoveryYtClientId.value,
    youtubeClientSecret: elements.discoveryYtClientSecret.value,
    instaEndpoint: elements.discoveryInstaEndpoint.value,
    instaApiKey: elements.discoveryInstaKey.value,
    tiktokEndpoint: elements.discoveryTiktokEndpoint.value,
    tiktokApiKey: elements.discoveryTiktokKey.value,
    searchQuery: elements.discoveryQuery.value,
    autoPipelineEnabled: elements.autoPipelineEnabled.checked,
    dailyTime: elements.autoDailyTime.value,
    defaultVoiceId: elements.autoDefaultVoice.value,
    defaultMusic: elements.autoDefaultMusic.value,
    defaultMusicVolume: parseInt(elements.autoMusicVolume.value) || 12
  };

  try {
    // 1. Save platform and schedule configs
    await fetch('/api/discovery-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    // 2. Save script styling context
    await fetch('/api/style', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style: elements.styleEditor.value })
    });

    showToast('Configurations Saved Successfully!');
    logConsole('Production & automation parameters synchronized.');
    updateSchedulerStatusText(config);
    await checkYouTubeAuthStatus();
  } catch (error) {
    console.error('Failed to save config:', error);
    showToast('Failed to save config');
  }
}

async function loadDiscoveryConfig() {
  try {
    const response = await fetch('/api/discovery-config');
    const config = await response.json();

    elements.discoveryYtKey.value = config.youtubeApiKey || '';
    elements.discoveryYtClientId.value = config.youtubeClientId || '';
    elements.discoveryYtClientSecret.value = config.youtubeClientSecret || '';
    elements.discoveryInstaEndpoint.value = config.instaEndpoint || '';
    elements.discoveryInstaKey.value = config.instaApiKey || '';
    elements.discoveryTiktokEndpoint.value = config.tiktokEndpoint || '';
    elements.discoveryTiktokKey.value = config.tiktokApiKey || '';
    elements.discoveryQuery.value = config.searchQuery || '';
    elements.autoPipelineEnabled.checked = config.autoPipelineEnabled || false;
    elements.autoDailyTime.value = config.dailyTime || '10:00';
    elements.autoDefaultVoice.value = config.defaultVoiceId || '21m00Tcm4TlvDq8ikWAM';
    elements.autoDefaultMusic.value = config.defaultMusic || 'random';
    elements.autoMusicVolume.value = config.defaultMusicVolume || 12;

    updateSchedulerStatusText(config);
    await checkYouTubeAuthStatus();
    await loadMusicLibrary();
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
}

function updateSchedulerStatusText(config) {
  if (config.autoPipelineEnabled) {
    elements.schedulerStatusText.textContent = `Daily scheduler active. Runs automatically at ${config.dailyTime}.`;
  } else {
    elements.schedulerStatusText.textContent = 'Daily automatic scheduler is currently inactive.';
  }
}

async function loadStyleGuidelines() {
  try {
    const response = await fetch('/api/style');
    const result = await response.json();
    elements.styleEditor.value = result.style || '';
  } catch (error) {
    console.error('Error loading style:', error);
  }
}

// Trigger Master Autonomous Pipeline Run
async function triggerAutonomousPipelineRun() {
  elements.btnTriggerAutonomousGiant.disabled = true;
  elements.activeProgressBarGroup.style.display = 'block';
  elements.activeProgressFill.style.width = '0%';
  
  elements.engineStatusBadge.textContent = 'Active';
  elements.engineStatusBadge.className = 'badge badge-active';
  
  logConsole('🤖 INITIALIZING AGENTIC VIDEO STITCHING ENGINE...');
  logConsole('Auto-saving config and triggering crawling + scripting + rendering...');

  // Helper step indicators
  const animateProgress = (width, text, stepId) => {
    elements.activeProgressFill.style.width = width;
    logConsole(`[ENGINE] ${text}`);
    document.querySelectorAll('.step-lbl').forEach(l => l.classList.remove('active'));
    if (stepId) document.getElementById(stepId).classList.add('active');
  };

  try {
    // Save configurations first
    const config = {
      youtubeApiKey: elements.discoveryYtKey.value,
      instaEndpoint: elements.discoveryInstaEndpoint.value,
      instaApiKey: elements.discoveryInstaKey.value,
      tiktokEndpoint: elements.discoveryTiktokEndpoint.value,
      tiktokApiKey: elements.discoveryTiktokKey.value,
      searchQuery: elements.discoveryQuery.value,
      autoPipelineEnabled: elements.autoPipelineEnabled.checked,
      dailyTime: elements.autoDailyTime.value,
      defaultVoiceId: elements.autoDefaultVoice.value,
      defaultMusic: elements.autoDefaultMusic.value,
      defaultMusicVolume: parseInt(elements.autoMusicVolume.value) || 12
    };
    
    await fetch('/api/discovery-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    animateProgress('15%', 'Crawling Instagram, TikTok & YouTube API search feeds...', 'step-lbl-crawl');
    const response = await fetch('/api/trigger-autonomous-run', { method: 'POST' });
    
    animateProgress('40%', 'Running Gemini safety scoring audit & rejection filters...', 'step-lbl-eval');
    const result = await response.json();

    if (result.success) {
      animateProgress('70%', 'Generating narration scripts & rendering ElevenLabs voiceover...', 'step-lbl-voice');
      
      setTimeout(() => {
        animateProgress('90%', 'Mixing vertical overlays & background tracks in FFmpeg...', 'step-lbl-render');
        
        setTimeout(async () => {
          animateProgress('100%', 'Production run complete! New Short added to your review queue.', '');
          elements.engineStatusBadge.textContent = 'Idle';
          elements.engineStatusBadge.className = 'badge';
          showToast('Autonomous Production Complete!');
          
          await fetchShorts();
          const loadedShort = shorts.find(s => s.id === result.result.shortId);
          if (loadedShort) {
            selectShort(loadedShort);
          }
        }, 1500);
      }, 1500);
    } else {
      elements.engineStatusBadge.textContent = 'Idle';
      elements.engineStatusBadge.className = 'badge';
      logConsole(`[ENGINE WARNING] Run paused: ${result.reason}`);
      showToast(`Autonomous production paused: ${result.reason}`);
      await fetchShorts();
    }
  } catch (error) {
    elements.engineStatusBadge.textContent = 'Idle';
    elements.engineStatusBadge.className = 'badge';
    console.error('Autonomous run failed:', error);
    logConsole('[ENGINE ERROR] Production cycle crashed. Inspect server logs.');
  } finally {
    elements.btnTriggerAutonomousGiant.disabled = false;
  }
}

// UI Log Helpers
function logConsole(message) {
  elements.consoleLog.innerHTML = `&gt; ${message}<br>${elements.consoleLog.innerHTML.substring(0, 500)}`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2500);
}

// --- YouTube OAuth & Upload Helper Actions ---

async function checkYouTubeAuthStatus() {
  try {
    const res = await fetch('/api/youtube/status');
    const data = await res.json();
    if (data.authenticated) {
      elements.ytAuthStatus.textContent = 'Status: Connected ✓';
      elements.ytAuthStatus.style.color = '#10b981';
      elements.btnYtAuth.textContent = 'Change YouTube Account';
    } else {
      elements.ytAuthStatus.textContent = 'Status: Not Connected';
      elements.ytAuthStatus.style.color = '#ef4444';
      elements.btnYtAuth.textContent = 'Log In With YouTube';
    }
  } catch (err) {
    console.error('Failed to fetch YouTube auth status:', err);
  }
}

async function startYouTubeOAuthFlow() {
  await saveDiscoveryConfig();
  try {
    const res = await fetch('/api/youtube/auth-url');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate auth url');
    }
    const data = await res.json();
    const width = 600, height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(
      data.authUrl,
      'YouTube Auth',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );
  } catch (err) {
    showToast(err.message);
    logConsole(`OAuth Error: ${err.message}`);
  }
}

async function uploadActiveShortToYouTube() {
  if (!activeShort) return;
  logConsole(`Uploading vertical draft for ${activeShort.id} to YouTube as private draft...`);
  elements.btnYtUploadVideo.disabled = true;
  elements.btnYtUploadVideo.textContent = 'Uploading...';

  try {
    const res = await fetch(`/api/youtube/upload/${activeShort.id}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Uploaded to YouTube!');
      logConsole(`YouTube upload succeeded! Video Short URL: ${data.youtubeUrl}`);
      elements.btnYtUploadVideo.style.display = 'none';
      await fetchShorts();
      const freshShort = shorts.find(s => s.id === activeShort.id);
      if (freshShort) selectShort(freshShort);
    } else {
      throw new Error(data.error || 'Upload execution failed.');
    }
  } catch (err) {
    showToast(err.message);
    logConsole(`YouTube Upload Failed: ${err.message}`);
  } finally {
    elements.btnYtUploadVideo.disabled = false;
    elements.btnYtUploadVideo.textContent = 'Upload to YouTube';
  }
}

// --- Music Library Manager Helper Actions ---

async function loadMusicLibrary() {
  try {
    const res = await fetch('/api/music');
    const data = await res.json();
    if (res.ok && data.success) {
      const files = data.files || [];
      elements.musicLibraryList.innerHTML = '';
      
      const renderSelect = elements.renderMusic;
      const schedulerSelect = elements.autoDefaultMusic;
      
      const curRenderVal = renderSelect.value;
      const curSchedVal = schedulerSelect.value;
      
      renderSelect.innerHTML = '<option value="auto">Let AI Decide 🪄</option><option value="none">No background music</option>';
      schedulerSelect.innerHTML = '<option value="auto">Let AI Decide 🪄</option><option value="random">Random Track</option><option value="none">No Music</option>';

      if (files.length === 0) {
        elements.musicLibraryList.innerHTML = '<div class="empty-state" style="font-size: 11px; color: #64748b;">No backing tracks in media/music/</div>';
        return;
      }

      files.forEach(filename => {
        const opt1 = document.createElement('option');
        opt1.value = filename;
        opt1.textContent = filename;
        renderSelect.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = filename;
        opt2.textContent = filename;
        schedulerSelect.appendChild(opt2);

        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.gap = '8px';
        item.style.padding = '4px 6px';
        item.style.background = 'white';
        item.style.border = '1px solid #e2e8f0';
        item.style.borderRadius = '4px';
        item.style.fontSize = '11px';

        item.innerHTML = `
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;" title="${filename}">${filename}</span>
          <audio src="/media/music/${filename}" style="width: 100px; height: 18px;"></audio>
          <button class="btn-delete-track" data-file="${filename}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px; padding: 0 4px;">×</button>
        `;

        item.querySelector('.btn-delete-track').addEventListener('click', async (e) => {
          const fileToDelete = e.target.getAttribute('data-file');
          if (confirm(`Delete track "${fileToDelete}"?`)) {
            await deleteBackingTrack(fileToDelete);
          }
        });

        elements.musicLibraryList.appendChild(item);
      });

      renderSelect.value = curRenderVal;
      schedulerSelect.value = curSchedVal;
    }
  } catch (err) {
    console.error('Failed to load music library:', err);
  }
}

async function uploadBackingTrackToLibrary() {
  const fileInput = elements.musicLibraryUpload;
  if (fileInput.files.length === 0) {
    showToast('Please select an audio file first.');
    return;
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  elements.btnMusicUpload.disabled = true;
  elements.btnMusicUpload.textContent = 'Uploading...';

  try {
    const res = await fetch('/api/upload-asset', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast('Track uploaded successfully!');
      fileInput.value = '';
      await loadMusicLibrary();
    } else {
      throw new Error(result.error || 'Upload failed.');
    }
  } catch (err) {
    showToast(err.message);
  } finally {
    elements.btnMusicUpload.disabled = false;
    elements.btnMusicUpload.textContent = 'Upload';
  }
}

async function deleteBackingTrack(filename) {
  try {
    const res = await fetch(`/api/music/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast('Track deleted.');
      await loadMusicLibrary();
    } else {
      throw new Error(result.error || 'Failed to delete.');
    }
  } catch (err) {
    showToast(err.message);
  }
}

// --- SFX Library ---

async function loadSfxLibrary() {
  try {
    const res = await fetch('/api/sfx');
    const data = await res.json();
    if (res.ok && data.success) {
      const files = data.files || [];
      if (elements.sfxLibraryList) elements.sfxLibraryList.innerHTML = '';

      const sfxSelect = elements.renderSfx;
      const curVal = sfxSelect ? sfxSelect.value : 'none';

      if (sfxSelect) {
        sfxSelect.innerHTML = '<option value="none">No sound effect</option>';
      }

      if (files.length === 0) {
        if (elements.sfxLibraryList) {
          elements.sfxLibraryList.innerHTML = '<div class="empty-state" style="font-size: 11px; color: #64748b;">No sound effects in media/sfx/ yet.</div>';
        }
        return;
      }

      files.forEach(filename => {
        // Add to dropdown
        if (sfxSelect) {
          const opt = document.createElement('option');
          opt.value = filename;
          opt.textContent = filename;
          sfxSelect.appendChild(opt);
        }

        // Build list item
        if (elements.sfxLibraryList) {
          const item = document.createElement('div');
          item.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 6px;background:white;border:1px solid #e2e8f0;border-radius:4px;font-size:11px;';
          item.innerHTML = `
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;" title="${filename}">${filename}</span>
            <audio src="/media/sfx/${filename}" style="width:100px;height:18px;"></audio>
            <button class="btn-delete-sfx" data-file="${filename}" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:0 4px;">×</button>
          `;
          item.querySelector('.btn-delete-sfx').addEventListener('click', async (e) => {
            const fileToDelete = e.target.getAttribute('data-file');
            if (confirm(`Delete sound effect "${fileToDelete}"?`)) {
              await deleteSfxTrack(fileToDelete);
            }
          });
          elements.sfxLibraryList.appendChild(item);
        }
      });

      if (sfxSelect) sfxSelect.value = curVal;
    }
  } catch (err) {
    console.error('Failed to load SFX library:', err);
  }
}

async function uploadSfxToLibrary() {
  const fileInput = elements.sfxLibraryUpload;
  if (!fileInput || fileInput.files.length === 0) {
    showToast('Please select an audio file first.');
    return;
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  elements.btnSfxUpload.disabled = true;
  elements.btnSfxUpload.textContent = 'Uploading...';

  try {
    const res = await fetch('/api/upload-asset?type=sfx', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast('Sound effect uploaded!');
      fileInput.value = '';
      await loadSfxLibrary();
    } else {
      throw new Error(result.error || 'Upload failed.');
    }
  } catch (err) {
    showToast(err.message);
  } finally {
    elements.btnSfxUpload.disabled = false;
    elements.btnSfxUpload.textContent = 'Upload';
  }
}

async function deleteSfxTrack(filename) {
  try {
    const res = await fetch(`/api/sfx/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast('Sound effect deleted.');
      await loadSfxLibrary();
    } else {
      throw new Error(result.error || 'Failed to delete.');
    }
  } catch (err) {
    showToast(err.message);
  }
}

// --- List Items Hover Actions Helpers ---

function openQuickPreview(short) {
  if (!short.finalMp4) return;
  elements.quickPreviewTitle.textContent = `Preview: ${short.id}`;
  elements.quickPreviewPlayer.src = short.finalMp4;
  elements.quickPreviewPlayer.load();
  elements.previewVideoModal.style.display = 'flex';
  elements.quickPreviewPlayer.play().catch(err => console.log('Auto-play blocked by browser.'));
}

async function toggleShortStatusQuick(short) {
  const nextStatus = short.status === 'Searching' ? 'Processing' : (short.status === 'Processing' ? 'Uploaded' : 'Searching');
  try {
    const res = await fetch(`/api/shorts/${short.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    });
    if (res.ok) {
      showToast(`Status updated to ${nextStatus}`);
      await fetchShorts();
    } else {
      throw new Error('Failed to toggle status.');
    }
  } catch (err) {
    showToast(err.message);
  }
}

async function deleteShortQuick(shortId) {
  try {
    const res = await fetch(`/api/shorts/${shortId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Short candidate deleted.');
      await fetchShorts();
      if (activeShort && activeShort.id === shortId) {
        elements.editModalOverlay.style.display = 'none';
        activeShort = null;
      }
    } else {
      throw new Error('Failed to delete video.');
    }
  } catch (err) {
    showToast(err.message);
  }
}

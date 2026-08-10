/**
 * RoomVision AI - Core Application Logic
 */

// 1. App State Object
const app = {
  currentScreen: 'landing',
  uploadedImage: null,
  selectedStyle: null,
  selectedBudget: 'medium',
  analysisComplete: false,
  savedDesigns: JSON.parse(localStorage.getItem('roomvision-designs') || '[]'),
  isNavOpen: false,
  liveImages: [],
  liveImageRequest: 0,
  liveStyleImages: {}
};

// 15. Helper: Generate SVG Icons
const icons = {
  upload: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  spinner: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  starEmpty: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  cart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"></path></svg>`,
  grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  sliders: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Seating': return icons.grid;
    case 'Tables': return icons.grid;
    case 'Lighting': return icons.sparkle;
    case 'Rugs': return icons.grid;
    case 'Decor': return icons.image;
    case 'Plants': return icons.heart;
    case 'Hardware': return icons.sliders;
    default: return icons.cart;
  }
};

// Products Data for Shopping Screen
const products = {
  modern: [
    { name: 'Aria Sectional Sofa', brand: 'MODLOFT', price: 2499, rating: 4.8, image: null, category: 'Seating' },
    { name: 'Marble Accent Table', brand: 'CB2', price: 449, rating: 4.6, image: null, category: 'Tables' },
    { name: 'Minimalist Floor Lamp', brand: 'FLOS', price: 380, rating: 4.9, image: null, category: 'Lighting' },
    { name: 'Geometric Area Rug 8×10', brand: 'WEST ELM', price: 599, rating: 4.5, image: null, category: 'Rugs' },
    { name: 'Abstract Canvas Art', brand: 'ARTISTRY', price: 289, rating: 4.7, image: null, category: 'Decor' },
    { name: 'Ceramic Planter Set', brand: 'CRATE & BARREL', price: 129, rating: 4.4, image: null, category: 'Plants' }
  ],
  classic: [
    { name: 'Chesterfield Velvet Sofa', brand: 'RESTORATION HARDWARE', price: 3899, rating: 4.9, image: null, category: 'Seating' },
    { name: 'Carved Walnut Coffee Table', brand: 'ETHAN ALLEN', price: 1299, rating: 4.7, image: null, category: 'Tables' },
    { name: 'Crystal Table Lamp Pair', brand: 'WATERFORD', price: 680, rating: 4.8, image: null, category: 'Lighting' },
    { name: 'Persian Wool Rug 9×12', brand: 'SAFAVIEH', price: 1899, rating: 4.6, image: null, category: 'Rugs' },
    { name: 'Oil Painting Gold Frame', brand: 'GALLERY ROW', price: 950, rating: 4.5, image: null, category: 'Decor' },
    { name: 'Brass Curtain Rod Set', brand: 'POTTERY BARN', price: 249, rating: 4.3, image: null, category: 'Hardware' }
  ],
  boho: [
    { name: 'Rattan Loveseat', brand: 'ANTHROPOLOGIE', price: 1599, rating: 4.7, image: null, category: 'Seating' },
    { name: 'Round Jute Coffee Table', brand: 'WORLD MARKET', price: 349, rating: 4.5, image: null, category: 'Tables' },
    { name: 'Macramé Hanging Planter', brand: 'URBAN OUTFITTERS', price: 45, rating: 4.8, image: null, category: 'Decor' },
    { name: 'Layered Kilim Rug 8×10', brand: 'LULU & GEORGIA', price: 799, rating: 4.6, image: null, category: 'Rugs' },
    { name: 'Woven Wall Tapestry', brand: 'FREE PEOPLE', price: 189, rating: 4.4, image: null, category: 'Decor' },
    { name: 'Dried Pampas Grass Bundle', brand: 'AFLORAL', price: 65, rating: 4.9, image: null, category: 'Plants' }
  ]
};

const analysisSteps = [
  { id: 'detect-room', label: 'Detecting room boundaries', duration: 1500, result: 'Living Room — 18×14 ft' },
  { id: 'detect-walls', label: 'Analyzing wall surfaces', duration: 1200, result: '4 walls detected, 1 accent wall' },
  { id: 'detect-furniture', label: 'Identifying furniture', duration: 1800, result: '6 items identified' },
  { id: 'detect-lighting', label: 'Evaluating lighting conditions', duration: 1000, result: 'Natural + ambient, 2 sources' },
  { id: 'detect-dimensions', label: 'Calculating spatial dimensions', duration: 1400, result: '252 sq ft usable space' },
  { id: 'detect-style', label: 'Analyzing current style profile', duration: 1600, result: 'Contemporary Casual' }
];

const fallbackImage = (style, index = 0) =>
  `https://loremflickr.com/640/480/${encodeURIComponent(`${style} interior furniture`)}/?lock=${style}-${index}`;

async function fetchLiveImages(style, count = 8) {
  const query = `${style} interior design furniture`;
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=${count}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&format=json&origin=*`;

  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Image service returned ${response.status}`);
    const data = await response.json();
    return Object.values(data.query?.pages || {})
      .map(page => page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url)
      .filter(Boolean)
      .slice(0, count);
  } catch (error) {
    return Array.from({ length: count }, (_, index) => fallbackImage(style, index));
  }
}

async function loadLiveShoppingImages() {
  const style = app.selectedStyle || 'modern';
  const targetProducts = products[style] || products.modern;
  const requestId = ++app.liveImageRequest;
  const status = document.getElementById('live-image-status');
  const refreshButton = document.getElementById('btn-refresh-images');
  if (status) status.textContent = 'Finding fresh room inspiration...';
  if (refreshButton) refreshButton.disabled = true;

  const images = await fetchLiveImages(style, targetProducts.length);
  if (requestId !== app.liveImageRequest) return;
  app.liveImages = images;
  targetProducts.forEach((product, index) => {
    product.image = images[index] || fallbackImage(style, index);
  });
  renderShopping(false);
  if (status) status.textContent = `Live ${style} inspiration updated`;
  if (refreshButton) refreshButton.disabled = false;
}

async function loadLiveStyleImages() {
  const styles = ['modern', 'classic', 'boho'];
  const imageGroups = await Promise.all(styles.map(style => fetchLiveImages(`${style} living room`, 2)));

  styles.forEach((style, index) => {
    app.liveStyleImages[style] = imageGroups[index][0] || fallbackImage(style, 0);
    const cardImage = document.querySelector(`.style-card[data-style="${style}"] img`);
    if (cardImage) cardImage.src = app.liveStyleImages[style];
  });
}

// 2. Screen Router
function navigateTo(screenId) {
  // Remove .active from all screens
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  
  // Add .active to target
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }

  // Update App state
  app.currentScreen = screenId;

  // Update navbar active link
  document.querySelectorAll('nav a[data-screen]').forEach(el => {
    if (el.getAttribute('data-screen') === screenId) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile nav
  if (app.isNavOpen) {
    toggleMobileNav();
  }

  // Trigger screen-specific logic
  if (screenId === 'dashboard') {
    renderDashboard();
  } else if (screenId === 'results') {
    initComparison();
  } else if (screenId === 'shopping') {
    renderShopping();
  } else if (screenId === 'styles') {
    loadLiveStyleImages();
  }
}

// 3. Navigation Setup
function initNavigation() {
  document.querySelectorAll('[data-screen]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const screenId = link.getAttribute('data-screen');
      navigateTo(screenId);
    });
  });

  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileNav);
  }

  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('landing');
    });
  }
  
  const getStartedBtn = document.getElementById('btn-get-started');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => navigateTo('upload'));
  }
  
  const tryNowBtn = document.getElementById('btn-try-now');
  if (tryNowBtn) {
    tryNowBtn.addEventListener('click', () => navigateTo('upload'));
  }

  const useDemoBtn = document.getElementById('btn-use-demo');
  if (useDemoBtn) {
    useDemoBtn.addEventListener('click', (event) => {
      event.preventDefault();
      handleImageUploadFromUrl('assets/images/room-before.png');
    });
  }

  const changePhotoBtn = document.getElementById('btn-change-photo');
  if (changePhotoBtn) {
    changePhotoBtn.addEventListener('click', () => document.getElementById('file-input')?.click());
  }

  const refreshImagesBtn = document.getElementById('btn-refresh-images');
  if (refreshImagesBtn) refreshImagesBtn.addEventListener('click', loadLiveShoppingImages);

  document.querySelectorAll('.btn-open-premium, #btn-premium').forEach(btn => {
    btn.addEventListener('click', openPremiumModal);
  });
}

function toggleMobileNav() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('nav-open');
    app.isNavOpen = navbar.classList.contains('nav-open');
  }
}

// 4. Image Upload System
function initUploadSystem() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  
  if (!uploadZone || !fileInput) return;

  // Drag and drop events
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  });

  // Click to upload
  uploadZone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  });

  // Remove upload
  const btnRemove = document.getElementById('btn-remove-upload');
  if (btnRemove) {
    btnRemove.addEventListener('click', () => {
      app.uploadedImage = null;
      document.getElementById('upload-preview').style.display = 'none';
      uploadZone.style.display = 'flex'; // Or whatever its default display is
      document.getElementById('upload-actions').style.display = 'none';
      fileInput.value = '';
    });
  }

  // Analyze button
  const btnAnalyze = document.getElementById('btn-analyze');
  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', () => {
      navigateTo('analysis');
      startAnalysis();
    });
  }
}

function handleImageUpload(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    app.uploadedImage = e.target.result;
    const previewContainer = document.getElementById('upload-preview');
    const previewImg = previewContainer.querySelector('img');
    const uploadZone = document.getElementById('upload-zone');
    const actions = document.getElementById('upload-actions');

    if (previewImg) previewImg.src = app.uploadedImage;
    if (previewContainer) previewContainer.style.display = 'block';
    if (uploadZone) uploadZone.style.display = 'none';
    if (actions) actions.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function handleImageUploadFromUrl(url) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => handleImageUpload(new File([blob], 'demo-room.png', { type: blob.type })))
    .catch(() => showToast('The demo room could not be loaded.', 'error'));
}

// 5. AI Analysis Simulation
function startAnalysis() {
  const analysisPreviewImg = document.querySelector('#screen-analysis .analysis-room-preview img');
  if (analysisPreviewImg) {
    analysisPreviewImg.src = app.uploadedImage || 'assets/images/room-before.png';
  }

  const progressFill = document.querySelector('#screen-analysis .progress-fill');
  if (progressFill) progressFill.style.width = '0%';
  
  const stepsContainer = document.querySelector('#screen-analysis .analysis-steps');
  if (stepsContainer) {
    stepsContainer.innerHTML = analysisSteps.map(step => `
      <div class="analysis-step pending" id="step-${step.id}">
        <div class="step-icon">${icons.spinner}</div>
        <div class="step-content">
          <div class="step-label">${step.label}</div>
          <div class="step-result">Pending...</div>
        </div>
      </div>
    `).join('');
  }

  let currentStep = 0;
  
  function runStep() {
    if (currentStep >= analysisSteps.length) {
      setTimeout(() => {
        navigateTo('styles');
      }, 800);
      return;
    }

    const stepData = analysisSteps[currentStep];
    const stepEl = document.getElementById(`step-${stepData.id}`);
    
    if (stepEl) {
      stepEl.classList.remove('pending');
      stepEl.classList.add('active');
      stepEl.querySelector('.step-result').textContent = 'Analyzing...';
      
      setTimeout(() => {
        stepEl.classList.remove('active');
        stepEl.classList.add('complete');
        stepEl.querySelector('.step-icon').innerHTML = icons.check;
        stepEl.querySelector('.step-result').textContent = stepData.result;
        
        if (progressFill) {
          progressFill.style.width = `${((currentStep + 1) / analysisSteps.length) * 100}%`;
        }
        
        currentStep++;
        runStep();
      }, stepData.duration);
    }
  }

  runStep();
}

// 6. Style Selection
function initStyleSelection() {
  const styleCards = document.querySelectorAll('.style-card');
  const btnContinue = document.getElementById('btn-continue-to-results');

  styleCards.forEach(card => {
    card.addEventListener('click', () => {
      styleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      app.selectedStyle = card.getAttribute('data-style');
      if (btnContinue) {
        btnContinue.disabled = false;
      }
    });
  });

  const budgetOptions = document.querySelectorAll('.budget-option');
  budgetOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      budgetOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      app.selectedBudget = opt.getAttribute('data-budget');
    });
  });

  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      if (app.selectedStyle) {
        navigateTo('results');
      }
    });
  }
}

// 7. Results Screen
function initComparison() {
  const container = document.getElementById('comparison-container');
  const beforeImg = document.getElementById('comparison-before');
  const afterImg = document.getElementById('comparison-after');
  const slider = document.getElementById('comparison-slider');

  if (!container || !beforeImg || !afterImg || !slider) return;

  const style = app.selectedStyle || 'modern';
  
  // Set images. If we don't have user image, use default before
  beforeImg.src = app.uploadedImage || 'assets/images/room-before.png';
  afterImg.src = app.liveStyleImages[style] || `assets/images/room-${style}.png`;

  let isDragging = false;

  const onDragStart = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  const onDragEnd = () => {
    isDragging = false;
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    
    const rect = container.getBoundingClientRect();
    let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    
    // Constrain x
    x = Math.max(0, Math.min(x, rect.width));
    const percentage = (x / rect.width) * 100;
    
    slider.style.left = `${percentage}%`;
    beforeImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  };

  slider.addEventListener('mousedown', onDragStart);
  slider.addEventListener('touchstart', onDragStart);
  
  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);
  
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag);

  // Initialize at 50%
  slider.style.left = '50%';
  beforeImg.style.clipPath = 'inset(0 50% 0 0)';

  // Variations click
  const variationCards = document.querySelectorAll('.variation-card');
  variationCards.forEach(card => {
    card.addEventListener('click', () => {
      variationCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const varStyle = card.getAttribute('data-variation');
      app.selectedStyle = varStyle; // update selected style
      afterImg.src = app.liveStyleImages[varStyle] || `assets/images/room-${varStyle}.png`;
    });
  });

  // Action Buttons
  const btnGenerateMore = document.getElementById('btn-generate-more');
  if (btnGenerateMore) {
    btnGenerateMore.addEventListener('click', () => {
      btnGenerateMore.classList.add('loading');
      setTimeout(() => {
        btnGenerateMore.classList.remove('loading');
        showToast('New variations generated!');
      }, 2000);
    });
  }

  const btnSaveDesign = document.getElementById('btn-save-design');
  if (btnSaveDesign) {
    btnSaveDesign.addEventListener('click', () => {
      const design = {
        id: Date.now(),
        style: app.selectedStyle,
        budget: app.selectedBudget,
        image: afterImg.src,
        date: new Date().toLocaleDateString(),
        name: `${app.selectedStyle.charAt(0).toUpperCase() + app.selectedStyle.slice(1)} Living Room`
      };
      app.savedDesigns.push(design);
      localStorage.setItem('roomvision-designs', JSON.stringify(app.savedDesigns));
      showToast('Design saved!');
    });
  }

  const btnViewShopping = document.getElementById('btn-view-shopping');
  if (btnViewShopping) {
    btnViewShopping.addEventListener('click', () => {
      navigateTo('shopping');
    });
  }
}

// 8. Shopping Screen
function renderShopping() {
  const updateLiveImages = arguments.length === 0;
  const container = document.querySelector('#screen-shopping .product-list');
  if (!container) return;

  const currentStyle = app.selectedStyle || 'modern';
  const currentProducts = products[currentStyle] || products['modern'];

  let totalBudget = 0;

  container.innerHTML = currentProducts.map(p => {
    totalBudget += p.price;
    return `
      <div class="product-card">
        <div class="product-image">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.replaceWith(document.createTextNode('Image unavailable'))">` : getCategoryIcon(p.category)}
        </div>
        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-rating">★★★★★ ${p.rating}</div>
          <div class="product-price">$${p.price.toLocaleString()}</div>
        </div>
        <button class="btn btn-sm btn-secondary product-action">View</button>
      </div>
    `;
  }).join('');

  const budgetTotalEl = document.getElementById('total-price');
  if (budgetTotalEl) {
    budgetTotalEl.textContent = `$${totalBudget.toLocaleString()}`;
  }

  const roomImage = document.getElementById('shopping-room-image');
  const styleBadge = document.getElementById('shopping-style-badge');
  const budgetBadge = document.getElementById('shopping-budget-badge');
  if (roomImage) roomImage.src = `assets/images/room-${currentStyle}.png`;
  if (styleBadge) styleBadge.textContent = currentStyle.charAt(0).toUpperCase() + currentStyle.slice(1);
  if (budgetBadge) budgetBadge.textContent = app.selectedBudget === 'premium' ? 'Premium' : app.selectedBudget === 'low' ? 'Budget' : 'Mid-Range';
  if (updateLiveImages) loadLiveShoppingImages();
}

// 9. Dashboard Screen
function renderDashboard() {
  const grid = document.querySelector('.dashboard-grid');
  const emptyState = document.querySelector('.empty-state');
  
  if (!grid || !emptyState) return;

  if (app.savedDesigns.length === 0) {
    emptyState.style.display = 'block';
    grid.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
    
    grid.innerHTML = app.savedDesigns.map(design => `
      <div class="dashboard-card" data-id="${design.id}">
        <div class="card-image">
          <img src="${design.image}" alt="${design.name}">
        </div>
        <div class="card-content">
          <div class="card-title">${design.name}</div>
          <div class="card-meta">
            <span class="card-style-badge badge">${design.style}</span>
            <span>${design.date}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-icon btn-ghost btn-delete" data-id="${design.id}" title="Delete">
            ${icons.trash}
          </button>
        </div>
      </div>
    `).join('');

    // Attach events
    const deleteBtns = grid.querySelectorAll('.btn-delete');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent clicking card
        const id = parseInt(btn.getAttribute('data-id'));
        app.savedDesigns = app.savedDesigns.filter(d => d.id !== id);
        localStorage.setItem('roomvision-designs', JSON.stringify(app.savedDesigns));
        renderDashboard();
        showToast('Design deleted', 'info');
      });
    });

    const cards = grid.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'));
        const design = app.savedDesigns.find(d => d.id === id);
        if (design) {
          app.selectedStyle = design.style;
          app.selectedBudget = design.budget;
          // Could also set app.uploadedImage if saved, but for sim we use default
          navigateTo('results');
        }
      });
    });
  }
}

// 10. Premium Modal
function openPremiumModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.add('active');
  }
}

function closePremiumModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('active');
  }
}

function initModal() {
  const modalCloseBtn = document.getElementById('modal-close');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePremiumModal);
  }

  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closePremiumModal();
      }
    });
  }
}

// 11. Toast Notification System
function showToast(message, type = 'success') {
  // Ensure CSS exists (simple inline inject if not present, though assuming CSS file covers it)
  const toastContainerId = 'toast-container';
  let toastContainer = document.getElementById(toastContainerId);
  
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = toastContainerId;
    toastContainer.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = 'background:var(--bg-elevated, #2a2a2a); color:#fff; padding:12px 20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.5); display:flex; align-items:center; gap:10px; opacity:0; transform:translateX(100%); transition:all 0.3s ease;';
  
  const iconHtml = type === 'success' ? icons.check : icons.sparkle;
  toast.innerHTML = `${iconHtml} <span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  // Trigger animation in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  // Auto remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 12. Intersection Observer
function initIntersectionObserver() {
  const elements = document.querySelectorAll('[data-animate]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animClass = entry.target.getAttribute('data-animate');
        entry.target.classList.add(animClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

// 13. Keyboard Navigation
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Escape closes modal
    if (e.key === 'Escape') {
      closePremiumModal();
    }
    
    // Arrow keys for budget selector if on styles screen
    if (app.currentScreen === 'styles') {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const options = Array.from(document.querySelectorAll('.budget-option'));
        const currentIdx = options.findIndex(opt => opt.classList.contains('active'));
        if (currentIdx !== -1) {
          let nextIdx = e.key === 'ArrowRight' ? currentIdx + 1 : currentIdx - 1;
          if (nextIdx < 0) nextIdx = options.length - 1;
          if (nextIdx >= options.length) nextIdx = 0;
          options[nextIdx].click();
        }
      }
    }
  });
}

// 14. Initialization
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initUploadSystem();
  initStyleSelection();
  initModal();
  initIntersectionObserver();
  initKeyboardNav();
  
  // Start on landing
  navigateTo('landing');
});

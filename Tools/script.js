document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const titleInput = document.getElementById('puzzle-title');
  const sentenceInput = document.getElementById('sentence-input');
  const gridSizeInput = document.getElementById('grid-size');
  const gridSizeVal = document.getElementById('grid-size-val');
  const minSizeLabel = document.getElementById('min-size-label');
  const generateBtn = document.getElementById('generate-btn');
  const displayTitle = document.getElementById('display-title');
  const gridContainer = document.getElementById('word-search-grid');
  const cluesList = document.getElementById('sentence-clues-list');
  const toggleSolutionBtn = document.getElementById('toggle-solution-btn');
  const printBtn = document.getElementById('print-btn');

  // Directions for 8-way word placement
  const DIRECTIONS = [
    { x: 1, y: 0 },   // Horizontal Right
    { x: -1, y: 0 },  // Horizontal Left
    { x: 0, y: 1 },   // Vertical Down
    { x: 0, y: -1 },  // Vertical Up
    { x: 1, y: 1 },   // Diagonal Down-Right
    { x: -1, y: -1 }, // Diagonal Up-Left
    { x: 1, y: -1 },  // Diagonal Up-Right
    { x: -1, y: 1 }   // Diagonal Down-Left
  ];

  let gridState = [];
  let currentWords = [];
  let solutionCoords = new Set();
  let foundCoords = new Set();
  let showSolution = false;

  // Selection Interaction Variables
  let isSelecting = false;
  let selectionStart = null;
  let currentSelection = [];

  // Update slider minimum bounds based on longest word
  function updateMinGridSize() {
    const text = sentenceInput.value;
    const words = parseTargetWords(text);
    let maxLen = 0;
    
    words.forEach(item => {
      if (item.word.length > maxLen) {
        maxLen = item.word.length;
      }
    });

    const minSize = Math.max(8, maxLen);
    gridSizeInput.min = minSize;
    minSizeLabel.textContent = `Min: ${minSize}x${minSize}`;

    if (parseInt(gridSizeInput.value) < minSize) {
      gridSizeInput.value = minSize;
    }
    gridSizeVal.textContent = `${gridSizeInput.value} x ${gridSizeInput.value}`;
  }

  // Parse text to find full ALL-CAPS target words and construct sentence clues
  function parseTargetWords(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const results = [];

    lines.forEach(line => {
      // Regular expression matching ALL-CAPS words (min 2 chars)
      const match = line.match(/\b[A-Z]{2,}\b/);
      if (match) {
        const targetWord = match[0];
        const dashReplacement = '─'.repeat(targetWord.length);
        const clueSentence = line.replace(targetWord, `<span class="word-blank">${dashReplacement}</span>`);
        results.push({
          word: targetWord,
          clue: clueSentence
        });
      }
    });

    return results;
  }

  // Generate blank NxN grid matrix
  function createEmptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(''));
  }

  // Try placing a word into grid
  function placeWord(grid, word, size) {
    const shuffledDirections = [...DIRECTIONS].sort(() => Math.random() - 0.5);
    const positions = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        positions.push({ r, c });
      }
    }
    positions.sort(() => Math.random() - 0.5);

    for (const pos of positions) {
      for (const dir of shuffledDirections) {
        if (canPlaceWord(grid, word, pos.r, pos.c, dir, size)) {
          const coords = [];
          for (let i = 0; i < word.length; i++) {
            const r = pos.r + i * dir.y;
            const c = pos.c + i * dir.x;
            grid[r][c] = word[i];
            coords.push(`${r}-${c}`);
          }
          return coords;
        }
      }
    }
    return null;
  }

  function canPlaceWord(grid, word, r, c, dir, size) {
    for (let i = 0; i < word.length; i++) {
      const nr = r + i * dir.y;
      const nc = c + i * dir.x;

      if (nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
      if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) return false;
    }
    return true;
  }

  // Fill remaining cells with random uppercase letters
  function fillRandomLetters(grid, size) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
        }
      }
    }
  }

  // Main puzzle generator
  function generatePuzzle() {
    updateMinGridSize();
    const size = parseInt(gridSizeInput.value);
    const parsedData = parseTargetWords(sentenceInput.value);

    if (parsedData.length === 0) {
      alert('Please enter at least one sentence containing a target word in ALL CAPS (e.g. "The SUN is bright.")');
      return;
    }

    displayTitle.textContent = titleInput.value.trim() || 'Word Search Puzzle';

    let grid = createEmptyGrid(size);
    solutionCoords.clear();
    foundCoords.clear();
    currentWords = [];

    // Sort longest words first for higher placement success rate
    const sortedWords = [...parsedData].sort((a, b) => b.word.length - a.word.length);

    sortedWords.forEach(item => {
      const coords = placeWord(grid, item.word, size);
      if (coords) {
        coords.forEach(coord => solutionCoords.add(coord));
        currentWords.push({ ...item, coords, found: false });
      }
    });

    fillRandomLetters(grid, size);
    gridState = grid;
    showSolution = false;
    toggleSolutionBtn.classList.remove('active');
    toggleSolutionBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      Show Solution
    `;

    renderGrid(size);
    renderClues(parsedData);
  }

  // Render Grid DOM
  function renderGrid(size) {
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 36px)`;
    gridContainer.innerHTML = '';

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = gridState[r][c];

        // Highlight solutions or found letters
        const coordKey = `${r}-${c}`;
        if (foundCoords.has(coordKey)) {
          cell.classList.add('found');
        } else if (showSolution && solutionCoords.has(coordKey)) {
          cell.classList.add('solution');
        }

        // Selection Handlers
        cell.addEventListener('mousedown', () => startSelection(r, c));
        cell.addEventListener('mouseenter', () => updateSelection(r, c));

        gridContainer.appendChild(cell);
      }
    }
  }

  // Render Sentence Clues
  function renderClues(parsedData) {
    cluesList.innerHTML = '';
    parsedData.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = item.clue;
      li.dataset.word = item.word;

      const wordObj = currentWords.find(w => w.word === item.word);
      if (wordObj && wordObj.found) {
        li.classList.add('found-word');
      }

      cluesList.appendChild(li);
    });
  }

  // Interactive Selection Processing
  function startSelection(r, c) {
    isSelecting = true;
    selectionStart = { r, c };
    currentSelection = [`${r}-${c}`];
    highlightCells();
  }

  function updateSelection(r, c) {
    if (!isSelecting) return;

    const dr = r - selectionStart.r;
    const dc = c - selectionStart.c;

    // Constrain selection line to valid 8 directions
    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;

      currentSelection = [];
      for (let i = 0; i <= steps; i++) {
        const currR = selectionStart.r + i * stepR;
        const currC = selectionStart.c + i * stepC;
        currentSelection.push(`${currR}-${currC}`);
      }
      highlightCells();
    }
  }

  function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    // Check if current selection matches any target word coordinates
    const selectedKey = currentSelection.join(',');
    const reverseSelectedKey = [...currentSelection].reverse().join(',');

    currentWords.forEach(w => {
      const wordKey = w.coords.join(',');
      if (selectedKey === wordKey || reverseSelectedKey === wordKey) {
        w.found = true;
        w.coords.forEach(coord => foundCoords.add(coord));
      }
    });

    currentSelection = [];
    renderGrid(parseInt(gridSizeInput.value));
    renderClues(parseTargetWords(sentenceInput.value));
  }

  function highlightCells() {
    const size = parseInt(gridSizeInput.value);
    const cells = gridContainer.children;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const key = `${cell.dataset.row}-${cell.dataset.col}`;

      cell.classList.remove('selecting');
      if (currentSelection.includes(key)) {
        cell.classList.add('selecting');
      }
    }
  }

  // Document Mouse Up Event listener
  document.addEventListener('mouseup', endSelection);

  // Event Listeners
  gridSizeInput.addEventListener('input', () => {
    gridSizeVal.textContent = `${gridSizeInput.value} x ${gridSizeInput.value}`;
  });

  sentenceInput.addEventListener('input', updateMinGridSize);

  generateBtn.addEventListener('click', generatePuzzle);

  toggleSolutionBtn.addEventListener('click', () => {
    showSolution = !showSolution;
    toggleSolutionBtn.classList.toggle('active', showSolution);
    toggleSolutionBtn.innerHTML = showSolution ? `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      Hide Solution
    ` : `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      Show Solution
    `;
    renderGrid(parseInt(gridSizeInput.value));
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });

  // Initial load
  generatePuzzle();
});
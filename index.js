// Check if user came from landing page
if (!localStorage.getItem('artconnect-username')) {
    // If not, redirect back to landing page
    window.location.href = 'index.html';
  }

document.addEventListener("DOMContentLoaded", () => {
    // Display welcome message
    const username = localStorage.getItem('artconnect-username');
    if (username) {
        document.getElementById('welcome-message').textContent = `Welcome back, ${username}!`;
    }

    // DOM Elements
    const gallery = document.getElementById('gallery');
    const modal = document.getElementById('art-modal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('artwork-form');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const loader = document.createElement('div');
    loader.className = 'loader';
    
    // Unsplash API Configuration
    const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your actual key
    const UNSPLASH_API_URL = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&count=20&query=art`;
    
    // Sample database (would be replaced with real API calls in production)
    let artworks = [];

    // Initialize the gallery
    initGallery();

    // Initialize the gallery
    async function initGallery() {
        // Show loading spinner
        gallery.appendChild(loader);
        loader.style.display = 'block';
        
        try {
            // Try to load from localStorage first
            const savedArtworks = localStorage.getItem('artconnect-artworks');
            
            if (savedArtworks && JSON.parse(savedArtworks).length > 0) {
                artworks = JSON.parse(savedArtworks);
                displayArtworks();
            } else {
                // If no saved artworks, fetch from Unsplash
                await fetchUnsplashArtworks();
            }
        } catch (error) {
            console.error("Error initializing gallery:", error);
            // Fallback to sample data if both methods fail
            loadSampleArtworks();
        } finally {
            loader.style.display = 'none';
        }
    }

    // Fetch random art photos from Unsplash
    async function fetchUnsplashArtworks() {
        try {
            const response = await fetch(UNSPLASH_API_URL);
            const unsplashPhotos = await response.json();
            
            // Transform Unsplash data to our format
            artworks = unsplashPhotos.map((photo, index) => ({
                id: index + 1,
                artist: photo.user.name || "Unknown Artist",
                artName: photo.alt_description || `Artwork ${index + 1}`,
                contact: photo.user.portfolio_url || `https://unsplash.com/@${photo.user.username}`,
                image: photo.urls.regular,
                description: photo.description || "No description available",
                credit: `Photo by ${photo.user.name} on Unsplash`,
                url: photo.links.html
            }));
            
            // Save to localStorage
            localStorage.setItem('artconnect-artworks', JSON.stringify(artworks));
            displayArtworks();
        } catch (error) {
            console.error("Error fetching from Unsplash:", error);
            loadSampleArtworks();
        }
    }

    // Display all artworks
    function displayArtworks(filteredArtworks = null) {
        gallery.innerHTML = '';
        const artsToDisplay = filteredArtworks || artworks;
        
        if (artsToDisplay.length === 0) {
            gallery.innerHTML = '<p class="no-results">No artworks found. Try a different search.</p>';
            return;
        }
        
        artsToDisplay.forEach(artwork => {
            const artworkEl = document.createElement('div');
            artworkEl.className = 'artwork';
            artworkEl.innerHTML = `
                <img src="${artwork.image}" alt="${artwork.artName}" loading="lazy">
                <div class="artwork-info">
                    <h3>${artwork.artName}</h3>
                    <p>By ${artwork.artist}</p>
                </div>
            `;
            
            artworkEl.addEventListener('click', () => showArtDetails(artwork));
            gallery.appendChild(artworkEl);
        });
    }

    // Show artwork details in modal
    function showArtDetails(artwork) {
        document.getElementById('modal-image').src = artwork.image;
        document.getElementById('modal-artist').textContent = artwork.artist;
        document.getElementById('modal-art-name').textContent = artwork.artName;
        document.getElementById('modal-contact').textContent = artwork.contact;
        document.getElementById('modal-description').textContent = artwork.description;
        document.getElementById('modal-credit').textContent = artwork.credit || 'Unknown source';
        modal.style.display = 'block';
    }

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newArtwork = {
            id: artworks.length + 1,
            artist: form['artist-name'].value,
            artName: form['art-name'].value,
            contact: form['artist-contact'].value,
            image: `https://source.unsplash.com/random/600x400/?art,signature=${Date.now()}`,
            description: form['art-description'].value,
            credit: "Uploaded by user"
        };

        artworks.unshift(newArtwork); // Add to beginning
        localStorage.setItem('artconnect-artworks', JSON.stringify(artworks));
        displayArtworks();
        form.reset();
        
        // Show success message
        alert('Artwork added successfully!');
    });

    // Search functionality
    searchBtn.addEventListener('click', searchArtworks);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchArtworks();
    });

    function searchArtworks() {
        const query = searchInput.value.toLowerCase();
        if (!query.trim()) {
            displayArtworks();
            return;
        }
        
        const filtered = artworks.filter(art => 
            art.artName.toLowerCase().includes(query) || 
            art.artist.toLowerCase().includes(query) ||
            art.description.toLowerCase().includes(query)
        );
        
        displayArtworks(filtered);
    }

    // Sample data fallback
    function loadSampleArtworks() {
        artworks = [
            {
                id: 1,
                artist: "Vincent van Gogh",
                artName: "Starry Night",
                contact: "museum@vangogh.com",
                image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
                description: "A famous oil painting depicting the view from Van Gogh's asylum room at Saint-Rémy-de-Provence.",
                credit: "Photo by Art Gallery on Unsplash"
            },
            {
                id: 2,
                artist: "Leonardo da Vinci",
                artName: "Mona Lisa",
                contact: "info@louvre.fr",
                image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
                description: "The most famous portrait in art history, known for its enigmatic smile.",
                credit: "Photo by Museum Archives on Unsplash"
            },
            // Additional sample entries...
            {
                id: 3,
                artist: "Pablo Picasso",
                artName: "Guernica",
                contact: "contact@pablopicasso.org",
                image: "https://images.unsplash.com/photo-1578301978018-3005750f3d9a",
                description: "Powerful anti-war painting depicting the bombing of Guernica during the Spanish Civil War.",
                credit: "Photo by Art Historian on Unsplash"
            },
            {
                id: 4,
                artist: "Claude Monet",
                artName: "Water Lilies",
                contact: "info@musee-orangerie.fr",
                image: "https://images.unsplash.com/photo-1579783900882-c0d3dad1179a",
                description: "Series of approximately 250 oil paintings depicting Monet's flower garden at Giverny.",
                credit: "Photo by Art Lover on Unsplash"
            },
            {
                id: 5,
                artist: "Frida Kahlo",
                artName: "The Two Fridas",
                contact: "info@museofridakahlo.org",
                image: "https://images.unsplash.com/photo-1580489944761-15c19dc0a0a8",
                description: "Double self-portrait showing two versions of Kahlo seated together.",
                credit: "Photo by Mexican Art on Unsplash"
            }
        ];
        
        localStorage.setItem('artconnect-artworks', JSON.stringify(artworks));
        displayArtworks();
    }
});
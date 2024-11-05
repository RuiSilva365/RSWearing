import { Component, OnInit } from '@angular/core';
interface TimelinePoint {
  title: string;
  index: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {

  isModalOpen = false;
  selectedImage: any = null;

  images = [
    { src: 'https://placehold.co/600x400/png', alt: 'Image 1', title: 'Phase 1', collection: 'New Arrivals', tags: ['new', 'black'] },
    { src: 'https://placehold.co/600x400/000000/FFFFFF/png', alt: 'Image 2', title: 'Phase 2', collection: 'Classic', tags: ['classic', 'white'] },
    { src: 'https://placehold.co/600x400?text=Hello+World', alt: 'Image 3', title: 'Custom Text', collection: 'Limited Edition', tags: ['custom', 'text'] },
    { src: 'https://placehold.co/600x400?text=Gallery+Item&font=roboto', alt: 'Image 4', title: 'Custom Font', collection: 'New Arrivals', tags: ['font', 'design'] },
    { src: 'https://placehold.co/600x400@2x.png', alt: 'Image 5', title: 'Retina Image', collection: 'Classic', tags: ['retina', 'high-res'] },
    { src: 'https://placehold.co/600x400/orange/white', alt: 'Image 6', title: 'Colored Background', collection: 'Limited Edition', tags: ['color', 'background'] },
    { src: 'https://placehold.co/600x400/png', alt: 'Image 1', title: 'Phase 1', collection: 'New Arrivals', tags: ['new', 'black'] },
    { src: 'https://placehold.co/600x400/000000/FFFFFF/png', alt: 'Image 2', title: 'Phase 2', collection: 'Classic', tags: ['classic', 'white'] },
    { src: 'https://placehold.co/600x400?text=Hello+World', alt: 'Image 3', title: 'Custom Text', collection: 'Limited Edition', tags: ['custom', 'text'] },
    { src: 'https://placehold.co/600x400?text=Gallery+Item&font=roboto', alt: 'Image 4', title: 'Custom Font', collection: 'New Arrivals', tags: ['font', 'design'] },
    { src: 'https://placehold.co/600x400@2x.png', alt: 'Image 5', title: 'Retina Image', collection: 'Classic', tags: ['retina', 'high-res'] },
    { src: 'https://placehold.co/600x400/orange/white', alt: 'Image 6', title: 'Colored Background', collection: 'Limited Edition', tags: ['color', 'background'] },
    // Add more images with collection and tags
  ];

  collections = ['New Arrivals', 'Classic', 'Limited Edition'];
  filteredImages = [...this.images];  // Initially display all images
  isBlackAndWhite = false;

  filterByCollection(event: any) {
    const selectedCollection = event.detail.value;
    this.filteredImages = this.images.filter(image => image.collection === selectedCollection);
  }

  toggleBlackAndWhite(event: any) {
    this.isBlackAndWhite = event.detail.checked;
  }

  filterByTag(event: any) {
    const tag = event.detail.value.toLowerCase();
    this.filteredImages = this.images.filter(image => image.tags.includes(tag));
  }

  timelinePoints = [
    { title: 'Start', index: 0 },
    { title: 'Phase 1', index: 1 },
    { title: 'Phase 2', index: 2 },
    // Add more timeline points as needed
  ];

  shuffleImages() {
    this.images = this.images
      .map((image) => ({ ...image, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort);
  }

    // Modal Logic
    openModal(image: any) {
      this.selectedImage = image;
      this.isModalOpen = true;
    }
  
    closeModal() {
      this.isModalOpen = false;
      this.selectedImage = null;
    }

  scrollTo(point: TimelinePoint) {
    const item = document.querySelector(`.gallery-item:nth-child(${point.index + 1})`);
    
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    } else {
      console.error('Gallery item not found for point:', point);
    }
  }
}


import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.scss']
})
export class EditAvatarComponent implements OnInit {
  @Input() currentAvatarUrl: string = '';
  @Output() avatarUpdated = new EventEmitter<string>();
  @Output() editorClosed = new EventEmitter<void>();

  avatarUrl: string = '';
  avatarOptions = {
    eyes: 'variant01',
    glasses: 'variant01',
    glassesOn: 'yes', // Default to showing glasses
    backgroundColor: 'b6e3f4',
    eyebrows: 'variant01',
    mouth: 'variant01',
    glassesProbability: 100 // Initialize based on the default glassesOn value
  };

  // Arrays to store the valid options
  eyeVariants = Array.from({ length: 26 }, (_, i) => `variant${(i + 1).toString().padStart(2, '0')}`);
  glassesVariants = ['variant01', 'variant02', 'variant03', 'variant04', 'variant05']; // Corrected glasses options
  eyebrowVariants = Array.from({ length: 15 }, (_, i) => `variant${(i + 1).toString().padStart(2, '0')}`);
  mouthVariants = Array.from({ length: 30 }, (_, i) => `variant${(i + 1).toString().padStart(2, '0')}`);

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.avatarUrl = this.currentAvatarUrl; // Set initial avatar URL from input
    this.updateAvatar(); // Generate avatar immediately
  }

  updateAvatar() {
    // Adjust glassesProbability based on glassesOn selection
    this.avatarOptions.glassesProbability = this.avatarOptions.glassesOn === 'yes' ? 100 : 0;

    // Update avatar URL with correct parameters
    this.avatarUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?eyes=${this.avatarOptions.eyes}&glasses=${this.avatarOptions.glasses}&backgroundColor=${this.avatarOptions.backgroundColor}&eyebrows=${this.avatarOptions.eyebrows}&mouth=${this.avatarOptions.mouth}&glassesProbability=${this.avatarOptions.glassesProbability}`;
    
    // Trigger change detection
    this.cdr.detectChanges();
    console.log('Generated Avatar URL:', this.avatarUrl);
  }

  saveAvatar() {
    this.avatarUpdated.emit(this.avatarUrl);
  }

  close() {
    this.editorClosed.emit(); // Emit the event to notify that the editor should be closed
  }
}

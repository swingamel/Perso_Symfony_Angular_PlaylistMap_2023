import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-list-playlist',
  templateUrl: './list-playlist.component.html',
  styleUrls: ['./list-playlist.component.css']
})
export class ListPlaylistComponent implements OnInit {

  showModal: boolean = false;
  playlists: any[] = [];

  newPlaylistName: string | undefined;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    const storedPlaylists = localStorage.getItem('playlists');
    if (storedPlaylists) {
      this.playlists = JSON.parse(storedPlaylists);
    } else {
      this.spotifyService.getPlaylists().subscribe(playlists => {
        this.playlists = playlists;
      });
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  createPlaylist(name: string) {
    this.spotifyService.createPlaylist(name).subscribe(playlist => {
      this.playlists = [...this.playlists, playlist];
      localStorage.setItem('playlists', JSON.stringify(this.playlists));
      this.closeModal();
    });
  }
}

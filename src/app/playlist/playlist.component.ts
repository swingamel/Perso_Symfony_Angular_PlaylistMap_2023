import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  showAddSongModal: boolean = false;
  searchQuery: string = '';
  searchResults: any[] = [];
  playlist: any;
  selectedSongId: number | null = null;
  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute) {}

  ngOnInit() {
    const playlistId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.loadPlaylist(playlistId);
  }

  loadPlaylist(playlistId: number): void {
    this.spotifyService.getPlaylist(playlistId).subscribe(
      response => {
        this.playlist = response;
      },
      error => {
        console.error('Error loading playlist:', error);
      }
    );
  }

  createPlaylist(name: string): void {
    this.spotifyService.createPlaylist(name).subscribe(
      response => {
        console.log('Playlist created:', response);
      },
      error => {
        console.error('Error creating playlist:', error);
      }
    );
  }

  openAddSongModal() {
    this.showAddSongModal = true;
  }

  closeAddSongModal() {
    this.showAddSongModal = false;
  }

  searchSongs() {
    this.spotifyService.searchSongs(this.searchQuery).subscribe(results => {
      this.searchResults = this.searchResults.concat(results);
    });
  }

  addSongToPlaylist(song: any) {
    if (!this.playlist || !this.playlist.id) {
      console.error('Playlist ID not found');
      return;
    }

    const playlistId = this.playlist.id;
    const songId = song.id || song.song_id;

    this.spotifyService.addSongToPlaylist(playlistId, songId).subscribe(response => {
      console.log('Song added to playlist:', response);
      this.closeAddSongModal();
      // Rechargez la playlist après avoir ajouté la chanson avec succès.
      this.loadPlaylist(playlistId);
    }, error => {
      console.error('Error adding song to playlist:', error);
    });
  }
}

import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlistsSubject = new BehaviorSubject<any[]>(this.getStoredPlaylists());
  playlists$ = this.playlistsSubject.asObservable();

  constructor() { }

  getStoredPlaylists(): any[] {
    const storedPlaylists = localStorage.getItem('playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : [];
  }

  storePlaylists(playlists: any[]): void {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }

  createPlaylist(name: string): void {
    const newPlaylist = { id: this.generateId(), name: name, songs: [] };
    const updatedPlaylists = [...this.playlistsSubject.value, newPlaylist];
    this.playlistsSubject.next(updatedPlaylists);
    this.storePlaylists(updatedPlaylists);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

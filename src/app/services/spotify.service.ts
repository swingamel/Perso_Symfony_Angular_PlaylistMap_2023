import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, forkJoin, from, map, Observable, of, switchMap, takeWhile, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private apiUrl = 'https://mmi.unilim.fr/~morap01/L250/public/index.php/api';

  constructor(private http: HttpClient) {
  }

  getAlbums(): Observable<Object> {
    return this.http.get(`${this.apiUrl}/albums`);
  }

  getAlbum(id: number): Observable<any> {
    return from(
      fetch(`${this.apiUrl}/albums/${id}`)
        .then(response => response.json())
    );
  }
  getSong(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/songs/${id}`);
  }


  searchSongs(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/songs?title=${query}`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else {
          return [response];
        }
      })
    );
  }

  searchArtists(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artists?name=${query}`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else {
          return [response];
        }
      })
    );
  }

  searchAlbums(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/albums?title=${query}`).pipe(
      map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else {
            return [response];
          }
        }
      ));
  }

/*  searchPlaylists(keyword: string): Observable<Playlist[]> {
    const url = `${this.apiUrl}/playlists?q=${keyword}`;
    return this.http.get<Playlist[]>(url);
  }*/

  getArtistAlbums(artistId: number, page?: number): Observable<Album[]> {
    let params = new HttpParams().set('artistId', artistId.toString());
    if (page) {
      params = params.set('page', page.toString());
    }
    return this.http.get<Album[]>(`${this.apiUrl}/albums`, { params });
  }

  getAllPlaylists(searchTerm?: string): Observable<any> {
    let id = 1;
    const playlists: any[] = [];

    return new Observable(observer => {
      const getPlaylist = () => {
        let params = new HttpParams();
        if (searchTerm) {
          params = params.append('q', searchTerm);
        }
        this.http.get(`${this.apiUrl}/playlists/${id}`, { params }).pipe(
          map((response: any) => {
            if (!searchTerm || response.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              playlists.push(response);
            }
            id++;
            if (response.id) {
              // continue the loop
              getPlaylist();
            } else {
              observer.next(playlists);
              observer.complete();
            }
          }),
          catchError(error => {
            // stop the loop and return the playlists that have been fetched so far
            observer.next(playlists);
            observer.complete();
            return [];
          }),
          takeWhile(() => id < 1000) // limit the loop to a maximum of 1000 iterations
        ).subscribe();
      };

      getPlaylist();
    });
  }

  createPlaylist(name: string): Observable<any> {
    const playlistData = {
      name: name
    };

    return this.http.post(`${this.apiUrl}/playlists`, playlistData);
  }

  addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
    const songUri = `${this.apiUrl}/songs/${songId}`;
    const patchData = {
      songs: [songUri]
    };

    return this.http.patch(`${this.apiUrl}/playlists/${playlistId}`, patchData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap(() => {
        const storedPlaylistStr = localStorage.getItem(`playlist-${playlistId}`);
        if (storedPlaylistStr) {
          const storedPlaylist = JSON.parse(storedPlaylistStr);
          storedPlaylist.songs.push(songUri);
          localStorage.setItem(`playlist-${playlistId}`, JSON.stringify(storedPlaylist));
        }
      })
    );
  }

  getPlaylist(id: number): Observable<any> {
    const storedPlaylist = localStorage.getItem(`playlist-${id}`);
    if (storedPlaylist) {
      return of(JSON.parse(storedPlaylist));
    } else {
      return this.http.get(`${this.apiUrl}/playlists/${id}`).pipe(
        tap((playlistData) => {
          localStorage.setItem(`playlist-${id}`, JSON.stringify(playlistData));
        })
      );
    }
  }
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`);
  }
}

export interface Album {
  id: number;
  title: string;
  image: string;
  artist: Artist;
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
}

export interface Song {
  id: number;
  title: string;
  length: number;
  youtube : string;
}

export interface Artist {
  id: number;
  name: string;
  songs: Song[];
  albums: Album[];
}

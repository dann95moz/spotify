// src/spotify.d.ts
declare namespace Spotify {
    export interface Player {
      new (options: PlayerOptions): Player;
      connect(): Promise<boolean>;
      disconnect(): void;
      getCurrentState(): Promise<PlaybackState | null>;
      on(event: PlayerEvent, callback: PlayerEventCallback): void;
      addListener(event: PlayerEvent, callback: PlayerEventCallback): void;
      removeListener(event: PlayerEvent, callback?: PlayerEventCallback): void;
      getVolume(): Promise<number>;
      setVolume(volume: number): Promise<void>;
      pause(): Promise<void>;
      resume(): Promise<void>;
      togglePlay(): Promise<void>;
      seek(position_ms: number): Promise<void>;
      previousTrack(): Promise<void>;
      nextTrack(): Promise<void>;
    }
  
    export interface PlayerOptions {
      name: string;
      getOAuthToken: (callback: (token: string) => void) => void;
      volume?: number;
    }
  
    export interface PlaybackState {
      context: {
        uri: string;
        metadata: object;
      };
      disallows: {
        resuming: boolean;
        skipping_prev: boolean;
        skipping_next: boolean;
        seeking: boolean;
        pausing: boolean;
        toggling_repeat_context: boolean;
        toggling_shuffle: boolean;
        toggling_repeat_track: boolean;
      };
      paused: boolean;
      position: number;
      repeat_mode: number;
      shuffle: boolean;
      track_window: {
        current_track: Track;
        next_tracks: Track[];
        previous_tracks: Track[];
      };
    }
  
    export interface Track {
      uri: string;
      id: string;
      type: string;
      media_type: string;
      name: string;
      is_playable: boolean;
      album: Album;
      artists: Artist[];
      duration_ms: number;
    }
  
    export interface Album {
      uri: string;
      name: string;
      images: Image[];
    }
  
    export interface Artist {
      uri: string;
      name: string;
    }
  
    export interface Image {
      url: string;
      height?: number;
      width?: number;
    }
  
    type PlayerEvent =
      | 'ready'
      | 'not_ready'
      | 'player_state_changed'
      | 'initialization_error'
      | 'authentication_error'
      | 'account_error'
      | 'playback_error';
  
    type PlayerEventCallback =
      | ((event: { device_id: string }) => void)
      | ((event: PlaybackState) => void)
      | ((event: Error) => void)
      | (() => void);
  }
  
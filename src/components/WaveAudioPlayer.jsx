import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveAudioPlayer = ({ url }) => {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#94a3b8',
      progressColor: '#16407A',
      cursorColor: '#16407A',
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 2,
      height: 48,
      barGap: 3,
      normalize: true
    });

    let objectUrl = null;

    const fetchAudio = async () => {
      try {
        const isExternal = url.startsWith('http');
        const fullUrl = isExternal ? url : `https://sipcon-backend.evokeaisolutions.com${url.startsWith('/') ? '' : '/'}${url}`;
        const headers = isExternal ? {} : { 'x-api-key': 'sip_9k2mXqLvT4rNwZdBpFhJeYcU8aGs3Ro', 'x-client-source': 'evoke' };

        const response = await fetch(fullUrl, { headers });
        if (response.ok) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          if (wavesurferRef.current) {
            wavesurferRef.current.load(objectUrl);
          }
        } else {
          console.error('Failed to fetch recording:', response.status);
        }
      } catch (err) {
        console.error('Failed to load audio:', err);
      }
    };

    fetchAudio();

    wavesurferRef.current.on('ready', () => {
      setIsReady(true);
      setDuration(formatTime(wavesurferRef.current.getDuration()));
    });

    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
    });

    wavesurferRef.current.on('seek', () => {
      setCurrentTime(formatTime(wavesurferRef.current.getCurrentTime()));
    });

    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <button
        onClick={togglePlayPause}
        disabled={!isReady}
        style={{
          background: isReady ? 'var(--color-primary)' : '#cbd5e1',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isReady ? 'pointer' : 'not-allowed',
          flexShrink: 0,
          transition: 'transform 0.1s ease',
          outline: 'none'
        }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
        )}
      </button>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div ref={containerRef} style={{ width: '100%' }}></div>
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', width: '70px', textAlign: 'right' }}>
        {currentTime} / {duration}
      </div>
    </div>
  );
};

export default WaveAudioPlayer;

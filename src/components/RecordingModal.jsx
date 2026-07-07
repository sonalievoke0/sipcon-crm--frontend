import React, { useState, useEffect, useRef } from 'react';
import { useCrm } from '../context/CrmContext';

const RecordingModal = ({ ticket, onClose, recordingUrl: externalRecordingUrl, recordingSummary: externalRecordingSummary }) => {
  if (!ticket) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSpeaker, setActiveSpeaker] = useState('System');
  const [recordingUrl, setRecordingUrl] = useState(externalRecordingUrl || '');
  const [recordingError, setRecordingError] = useState('');
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);
  const [hasFetchedRecording, setHasFetchedRecording] = useState(Boolean(externalRecordingUrl));
  const [summary, setSummary] = useState(externalRecordingSummary || ticket.summary || ticket.notes || ticket.query_text || 'No summary recorded in database.');
  const [totalSeconds, setTotalSeconds] = useState(Math.max(45, Math.min(180, (ticket.query_text || '').length * 2)));

  const { fetchRecording } = useCrm();
  const ticketId = ticket.ticketID || ticket.ticket_id;
  const audioRef = useRef(null);

  useEffect(() => {
    setRecordingUrl(externalRecordingUrl || '');
    setHasFetchedRecording(Boolean(externalRecordingUrl));
    if (externalRecordingUrl) {
      setRecordingError('');
    }
  }, [externalRecordingUrl]);

  useEffect(() => {
    setSummary(externalRecordingSummary || ticket.summary || ticket.notes || ticket.query_text || 'No summary recorded in database.');
  }, [externalRecordingSummary, ticket]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFetchRecording = async () => {
    setIsRecordingLoading(true);
    setRecordingError('');
    setHasFetchedRecording(false);
    try {
      const data = await fetchRecording(ticketId);

      if (data.success && data.recording) {
        setRecordingUrl(data.recording.recordURL);
        setSummary(data.recording.summary || summary);
      } else {
        setRecordingUrl('');
        setRecordingError(data.message || 'Ticket is in progress to resolve. No recording is currently available.');
      }
    } catch (error) {
      console.error('Error fetching recording:', error);
      setRecordingUrl('');
      setRecordingError('Ticket is in progress to resolve. No recording is currently available.');
    } finally {
      setIsRecordingLoading(false);
      setHasFetchedRecording(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setTotalSeconds(Math.max(45, audio.duration || totalSeconds));
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActiveSpeaker('Idle');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [recordingUrl, totalSeconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.error('Audio play failed:', err));
      setActiveSpeaker('Recorded Call Track');
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!recordingUrl) return;
    setIsPlaying((prev) => !prev);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary), #1e3a8a)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              🎧
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>
                Call Recording & Database Summary
              </h3>
              <div style={{ fontSize: '15px', opacity: 0.85, marginTop: '2px' }}>
                Ticket {ticket.ticket_id} • {ticket.company_name || 'Client Support'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Audio Waveform Player Section */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Audio Track ({ticket.machine_name || 'General Query'})
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: isPlaying ? '#dcfce7' : '#f1f5f9',
                color: isPlaying ? '#15803d' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isPlaying ? '#22c55e' : '#94a3b8',
                  display: 'inline-block',
                  animation: isPlaying ? 'pulse 1.5s infinite' : 'none'
                }} />
                {isPlaying ? 'Playing Audio...' : 'Ready to Play'}
              </span>
            </div>

            {isRecordingLoading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '18px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#e2e8f0',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb, #60a5fa)'
                  }} />
                </div>
                <div style={{ color: '#1e3a8a', fontWeight: '700' }}>Fetching recording...</div>
              </div>
            ) : recordingError && hasFetchedRecording ? (
              <div style={{
                color: '#1e3a8a',
                backgroundColor: '#e0f2fe',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                padding: '18px',
                marginTop: '18px',
                fontSize: '15px'
              }}>
                Ticket is in progress to resolve. No recording is currently available.
              </div>
            ) : recordingUrl ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={togglePlay}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(22, 64, 122, 0.3)',
                      transition: 'transform 0.1s, background 0.2s'
                    }}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px', height: '44px', padding: '0 4px' }}>
                    {[
                      25, 35, 50, 40, 65, 85, 95, 75, 45, 60, 80, 100, 90, 70, 50, 65, 85, 95, 80, 55,
                      40, 70, 90, 100, 85, 60, 45, 75, 95, 80, 65, 50, 70, 90, 100, 85, 55, 40, 60, 80,
                      95, 75, 50, 65, 85, 90, 70, 45, 60, 80, 95, 85, 65, 50, 70, 85, 75, 55, 40, 30
                    ].map((height, i, arr) => {
                      const animatedHeight = isPlaying 
                        ? Math.max(15, Math.min(100, height * (0.55 + Math.sin(currentTime * 2.5 + i * 0.6) * 0.45)))
                        : Math.max(12, height * 0.35);
                      const isPassed = (i / arr.length) <= (currentTime / totalSeconds);
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            minWidth: '2.5px',
                            maxWidth: '3.5px',
                            height: `${animatedHeight}%`,
                            backgroundColor: isPassed ? 'var(--color-primary)' : '#cbd5e1',
                            borderRadius: '10px',
                            transition: isPlaying ? 'height 0.12s ease' : 'height 0.3s ease, background-color 0.3s ease'
                          }}
                        />
                      );
                    })}
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '600', color: '#334155', minWidth: '95px', textAlign: 'right' }}>
                    {formatTime(currentTime)} / {formatTime(totalSeconds)}
                  </div>
                </div>

                <audio ref={audioRef} style={{ display: 'none' }}>
                  <source src={recordingUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}>
                {!externalRecordingUrl && (
                  <button
                    onClick={handleFetchRecording}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    Listen to Call Recording
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Database Summary Section */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: '360px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>📋</span>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                Ticket Summary (Database)
              </h4>
            </div>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '1.6'
            }}>
              {summary}
            </div>
          </div>


        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close Recording
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingModal;

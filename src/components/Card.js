import React from 'react';
import { formatAge } from '../utils/formatters';

export default function Card({ 
  category, trend, rank, isOpen, onToggle, 
  likes, liked, onLike, onShare, onTweet 
}) {
  if (!trend) return null;
  
  const isNew = trend.hoursOld < 2;
  const isRank1 = rank === 1;

  return (
    <div
      className={`card ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      style={{
        background: isOpen 
          ? `linear-gradient(135deg, ${category.color}15, transparent)`
          : 'rgba(255,255,255,0.03)',
        border: isOpen
          ? `1px solid ${category.color}55`
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '20px',
        padding: '18px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isRank1 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${category.color}, transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {/* Rank number */}
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isRank1 ? '36px' : '28px',
          fontWeight: '900',
          color: isRank1 ? category.color : '#2a2a3a',
          lineHeight: 1,
          minWidth: '32px',
          marginTop: '2px',
          letterSpacing: '-0.04em',
          textShadow: isRank1 ? `0 0 20px ${category.color}88` : 'none',
        }}>
          {rank}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row: badge + vibe + age */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '8px', 
            flexWrap: 'wrap' 
          }}>
            <span style={{
              background: category.color,
              color: '#000',
              fontSize: '10px',
              fontWeight: '900',
              padding: '3px 10px',
              borderRadius: '100px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {category.icon} {category.label}
            </span>

            {trend.vibe && (
              <span style={{
                fontSize: '11px', fontWeight: '700',
                color: '#ffffff99',
                background: 'rgba(255,255,255,0.06)',
                padding: '3px 9px', borderRadius: '100px',
              }}>
                {trend.vibe}
              </span>
            )}

            <span style={{
              fontSize: '11px', fontWeight: '600',
              color: isNew ? '#06D6A0' : '#444',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {isNew && (
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#06D6A0', display: 'inline-block',
                  animation: 'blink 1s infinite',
                }} />
              )}
              {formatAge(trend.hoursOld)}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '17px', fontWeight: '800',
            color: '#fff', lineHeight: 1.3,
            letterSpacing: '-0.02em',
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: '4px',
          }}>
            {trend.title}
          </div>

          {/* Expanded reason */}
          {isOpen && (
            <div style={{
              marginTop: '12px', fontSize: '14px',
              color: '#aaa', lineHeight: 1.7,
              paddingTop: '12px',
              borderTop: `1px solid rgba(255,255,255,0.06)`,
              animation: 'fadeUp 0.2s ease both',
            }}>
              {trend.reason}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Like button */}
            <button
              onClick={onLike}
              style={{
                background: liked ? `${category.color}22` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${liked ? category.color + '88' : 'rgba(255,255,255,0.1)'}`,
                color: liked ? category.color : '#666',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '12px', fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.15s',
              }}
            >
              {liked ? '♥' : '♡'} {likes.toLocaleString()}
            </button>

            {/* Copy button */}
            <button
              className="share-btn"
              onClick={onShare}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#666',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '12px', fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.15s',
                opacity: 0.8,
              }}
            >
              ⎘ copy
            </button>

            {/* Tweet button */}
            <button
              className="share-btn"
              onClick={onTweet}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#666',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '12px', fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.15s',
                opacity: 0.8,
              }}
            >
              𝕏 tweet
            </button>
          </div>
        </div>

        {/* Talking count */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '22px', fontWeight: '900',
            color: category.color, lineHeight: 1,
            letterSpacing: '-0.03em',
            textShadow: `0 0 16px ${category.color}66`,
          }}>
            {trend.talking}
          </div>
          <div style={{ 
            fontSize: '10px', color: '#444', 
            marginTop: '3px', letterSpacing: '0.05em', 
            textTransform: 'uppercase' 
          }}>
            talking
          </div>
        </div>
      </div>
    </div>
  );
}
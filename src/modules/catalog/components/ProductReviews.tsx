'use client';

import React, { useState } from 'react';
import { Review } from '@/types';
import { submitReview } from '@/lib/api';
import { Star, CheckCircle, MessageSquare, Send, Sparkles } from 'lucide-react';

interface Props {
  productId: number;
  productName: string;
  initialReviews: Review[];
  currentRating: string | number;
  currentReviewCount: number;
  onReviewSubmitted?: (newRating: string | number, newCount: number, newReview: Review) => void;
}

export const ProductReviews: React.FC<Props> = ({
  productId,
  productName,
  initialReviews,
  currentRating,
  currentReviewCount,
  onReviewSubmitted,
}) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync initialReviews when prop updates
  React.useEffect(() => {
    setReviewsList(initialReviews);
  }, [initialReviews]);

  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Calculate rating stats
  const totalCount = reviewsList.length || currentReviewCount || 0;
  const avgRatingNum = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
    : Number(currentRating || 5.0).toFixed(1);

  const starCounts = [5, 4, 3, 2, 1].map((starVal) => {
    const cnt = reviewsList.filter((r) => r.rating === starVal).length;
    const pct = totalCount > 0 ? Math.round((cnt / totalCount) * 100) : starVal === 5 ? 100 : 0;
    return { starVal, cnt, pct };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !author.trim() || !comment.trim()) {
      setErrorMsg('Please enter your Order Number, Name, and Review comment.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await submitReview({
        productId,
        orderNumber: orderNumber.trim(),
        author: author.trim(),
        rating,
        title: title.trim() || 'Customer Review',
        comment: comment.trim(),
      });

      if (res.success && res.data) {
        const { review, updatedRating, updatedReviewCount } = res.data;
        setReviewsList((prev) => [review, ...prev]);
        setSuccessMsg('Thank you! Your verified purchase review has been submitted successfully.');
        setOrderNumber('');
        setAuthor('');
        setTitle('');
        setComment('');
        setRating(5);
        setShowForm(false);

        if (onReviewSubmitted) {
          onReviewSubmitted(updatedRating, updatedReviewCount, review);
        }
      } else {
        setErrorMsg(res.message || 'Failed to submit review. Please verify your Order Number.');
      }
    } catch (err: any) {
      setErrorMsg('Error submitting review. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviews-module">
      <div className="reviews-header-row">
        <div>
          <h3 className="reviews-title">Customer Ratings & Reviews</h3>
          <p className="reviews-subtitle">Real feedback from verified buyers of {productName}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary write-review-toggle-btn"
        >
          <MessageSquare size={16} />
          <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Summary Box & Stats */}
      <div className="reviews-summary-grid">
        <div className="score-box">
          <div className="big-score">{avgRatingNum}</div>
          <div className="score-stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(Number(avgRatingNum)) ? 'var(--color-gold)' : '#e2e8f0'}
                color={i < Math.round(Number(avgRatingNum)) ? 'var(--color-gold)' : '#cbd5e1'}
              />
            ))}
          </div>
          <div className="score-count">Based on {totalCount} {totalCount === 1 ? 'review' : 'reviews'}</div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="bars-box">
          {starCounts.map(({ starVal, pct }) => (
            <div key={starVal} className="bar-row">
              <span className="bar-label">{starVal} ★</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="bar-pct">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="alert-success">
          <CheckCircle size={18} color="#15803d" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="review-form-card">
          <div className="form-header-badge">
            <Sparkles size={16} color="var(--color-gold)" />
            <span>Verified Purchase Required • 1 Review per Order</span>
          </div>

          <h4 className="form-heading">Rate & Review Product</h4>

          {errorMsg && <div className="alert-error">{errorMsg}</div>}

          <div className="form-group">
            <label className="form-label">Your Rating</label>
            <div className="star-rating-selector">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  type="button"
                  key={starVal}
                  className="star-btn"
                  onMouseEnter={() => setHoverRating(starVal)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starVal)}
                >
                  <Star
                    size={28}
                    fill={starVal <= (hoverRating || rating) ? 'var(--color-gold)' : 'none'}
                    color={starVal <= (hoverRating || rating) ? 'var(--color-gold)' : '#cbd5e1'}
                  />
                </button>
              ))}
              <span className="rating-num-tag">{hoverRating || rating} out of 5</span>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Order Number / ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. NTX-882103"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="form-input"
              />
              <span className="form-hint">Enter your order ID from purchase confirmation. Max 1 review per order.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Review Headline (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Outstanding quality & fresh taste!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Review *</label>
            <textarea
              required
              rows={4}
              placeholder="What did you like or dislike about this product?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary submit-btn"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Rating & Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviewsList.length === 0 ? (
          <div className="no-reviews-box">
            <Sparkles size={32} color="var(--color-gold)" style={{ marginBottom: '0.5rem' }} />
            <p className="no-reviews-title">No reviews yet for this product</p>
            <p className="no-reviews-text">Be the first to share your thoughts and help others!</p>
          </div>
        ) : (
          <>
            {reviewsList.slice(0, visibleCount).map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-card-header">
                  <div className="author-info">
                    <div className="author-avatar">
                      {(rev.author || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="author-meta">
                      <div className="author-name-row">
                        <span className="author-name">{rev.author || 'Anonymous'}</span>
                      </div>
                      <div className="author-sub-row">
                        <span className="review-date">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                        </span>
                        {rev.verified && (
                          <span className="verified-badge">
                            <CheckCircle size={11} color="#15803d" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < rev.rating ? 'var(--color-gold)' : '#e2e8f0'}
                        color={i < rev.rating ? 'var(--color-gold)' : '#cbd5e1'}
                      />
                    ))}
                  </div>
                </div>

                {rev.title && <h5 className="review-headline">{rev.title}</h5>}
                <p className="review-comment">{rev.comment}</p>
              </div>
            ))}

            {/* Pagination / View More Reviews Button */}
            {reviewsList.length > 10 && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                {visibleCount < reviewsList.length ? (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '30px',
                      border: '1.5px solid var(--color-forest)',
                      backgroundColor: '#ffffff',
                      color: 'var(--color-forest)',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>View More Reviews (Showing {visibleCount} of {reviewsList.length})</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    ✓ Showing all {reviewsList.length} verified reviews
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .reviews-module {
          margin-top: 3.5rem;
          padding-top: 2.5rem;
          padding-bottom: 4.5rem;
          border-top: 1px solid var(--color-border);
        }

        .reviews-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .reviews-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-forest);
          margin-bottom: 0.2rem;
        }

        .reviews-subtitle {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }

        .write-review-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem !important;
          font-size: 0.85rem !important;
        }

        .reviews-summary-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2rem;
          background-color: var(--color-bg-light);
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .score-box {
          text-align: center;
          border-right: 1px solid var(--color-border);
          padding-right: 1.5rem;
        }

        .big-score {
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--color-forest);
          line-height: 1;
          margin-bottom: 0.4rem;
        }

        .score-stars {
          display: flex;
          justify-content: center;
          gap: 3px;
          margin-bottom: 0.4rem;
        }

        .score-count {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .bars-box {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .bar-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .bar-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-forest);
          width: 32px;
        }

        .bar-track {
          flex: 1;
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 999px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background-color: var(--color-gold);
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .bar-pct {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          width: 36px;
          text-align: right;
          font-weight: 600;
        }

        .alert-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 0.9rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .alert-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .review-form-card {
          background-color: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: 18px;
          padding: 1.75rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .form-heading {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-forest);
          margin-bottom: 1.2rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-forest);
          margin-bottom: 0.4rem;
        }

        .star-rating-selector {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .star-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          transition: transform 0.15s ease;
        }

        .star-btn:hover {
          transform: scale(1.15);
        }

        .rating-num-tag {
          margin-left: 0.8rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-gold-dark, #b45309);
          background-color: var(--color-gold-light);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--color-border);
          border-radius: 10px;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus, .form-textarea:focus {
          border-color: var(--color-gold);
        }

        .form-textarea {
          resize: vertical;
        }

        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem !important;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .no-reviews-box {
          text-align: center;
          padding: 3rem 1.5rem;
          background-color: var(--color-bg-light);
          border: 1px dashed var(--color-border);
          border-radius: 16px;
        }

        .no-reviews-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--color-forest);
          margin-bottom: 0.3rem;
        }

        .no-reviews-text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .review-card {
          background-color: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .review-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          flex: 1;
        }

        .author-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--color-forest);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .author-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .author-name-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .author-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-forest);
          line-height: 1.3;
        }

        .author-sub-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #15803d;
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .review-date {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          white-space: nowrap;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }

        .review-headline {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-forest);
          margin-bottom: 0.4rem;
        }

        .review-comment {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          word-break: break-word;
        }

        .form-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-gold-dark, #b45309);
          background-color: var(--color-gold-light);
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .form-hint {
          display: block;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-top: 0.3rem;
        }

        @media (max-width: 640px) {
          .reviews-module {
            margin-top: 2rem;
            padding-top: 1.5rem;
            padding-bottom: 5rem;
          }
          .reviews-summary-grid {
            grid-template-columns: 1fr;
            padding: 1.2rem;
            gap: 1.2rem;
          }
          .score-box {
            border-right: none;
            border-bottom: 1px solid var(--color-border);
            padding-right: 0;
            padding-bottom: 1.2rem;
          }
          .reviews-header-row {
            flex-direction: column;
            align-items: stretch;
          }
          .write-review-toggle-btn {
            width: 100%;
            justify-content: center;
          }
          .review-card {
            padding: 1rem;
          }
          .review-form-card {
            padding: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .big-score {
            font-size: 2.3rem;
          }
          .reviews-title {
            font-size: 1.2rem;
          }
          .bar-label {
            width: 28px;
            font-size: 0.75rem;
          }
          .bar-pct {
            width: 32px;
            font-size: 0.75rem;
          }
          .review-card-header {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

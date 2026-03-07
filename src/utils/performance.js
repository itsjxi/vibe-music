// Performance Monitoring Utility
// Tracks and optimizes app performance

class PerformanceMonitor {
  static metrics = new Map();

  // Start timing an operation
  static startTimer(label) {
    this.metrics.set(label, performance.now());
  }

  // End timing and log if slow
  static endTimer(label, threshold = 1000) {
    const start = this.metrics.get(label);
    if (start) {
      const duration = performance.now() - start;
      if (duration > threshold) {
        console.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`);
      }
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }

  // Debounce function for performance
  static debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function for performance
  static throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Lazy load images
  static lazyLoadImage(img) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            observer.unobserve(image);
          }
        });
      });
      observer.observe(img);
    } else {
      img.src = img.dataset.src;
    }
  }
}

export default PerformanceMonitor;

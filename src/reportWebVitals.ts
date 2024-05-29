import * as webVitals from 'web-vitals';

type ReportHandler = (metric: webVitals.Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    (webVitals as any).getCLS(onPerfEntry);
    (webVitals as any).getFID(onPerfEntry);
    (webVitals as any).getFCP(onPerfEntry);
    (webVitals as any).getLCP(onPerfEntry);
    (webVitals as any).getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
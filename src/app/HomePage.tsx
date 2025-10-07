import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-6">はかったけ</h1>
      <p className="mb-8">ブラウザで手軽に測定・記録</p>
      <div className="space-y-4 flex flex-col">
        <Link to="/measure" className="btn btn-primary btn-lg max-w-xs mx-auto">
          計測モード
        </Link>
        <Link to="/growth-record" className="btn btn-secondary btn-lg max-w-xs mx-auto">
          成長記録モード
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

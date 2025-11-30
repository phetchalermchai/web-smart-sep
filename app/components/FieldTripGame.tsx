'use client';

import { useState, useEffect } from 'react';

export default function FieldTripGame() {
  // ข้อมูลโจทย์ (ตามที่คุณให้มา)
  const questions = [
    { id: 1, text: "ป่า 3 อย่าง ประโยชน์ 4 อย่าง", region: "N", regionName: "ภาคเหนือ" },
    { id: 2, text: "ป่าเปียกกันไฟ", region: "N", regionName: "ภาคเหนือ" },
    { id: 3, text: "ฝายชะลอความชุ่มชื้น", region: "N", regionName: "ภาคเหนือ" },
    { id: 4, text: "ปลูกต้นไม้ในใจคน", region: "N", regionName: "ภาคเหนือ" },
    { id: 5, text: "เกษตรทฤษฎีใหม่", region: "C", regionName: "ภาคกลาง" },
    { id: 6, text: "การเกษตรที่ใช้น้ำน้อย", region: "NE", regionName: "ภาคอีสาน" },
    { id: 7, text: "ธนาคารข้าว", region: "NE", regionName: "ภาคอีสาน" },
    { id: 8, text: "โครงการแก้มลิง", region: "S", regionName: "ภาคใต้" },
    { id: 9, text: "การบำบัดน้ำเสีย", region: "S", regionName: "ภาคใต้" },
    { id: 10, text: "กังหันน้ำชัยพัฒนา", region: "S", regionName: "ภาคใต้" },
    { id: 11, text: "พลังงานทดแทน (ลม/แสงแดด)", region: "S", regionName: "ภาคใต้" },
    { id: 12, text: "การแกล้งดิน", region: "S", regionName: "ภาคใต้" },
  ];

  const [gameState, setGameState] = useState('start'); // start, playing, end
  const [currentQ, setCurrentQ] = useState<{ id: number; text: string; region: string; regionName: string } | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null); // correct, wrong

  // เริ่มเกม
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    nextQuestion();
  };

  // สุ่มคำถาม
  const nextQuestion = () => {
    const random = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(random);
    setFeedback(null);
  };

  // ตรวจคำตอบ
  const handleAnswer = (selectedRegion: string) => {
    if (!currentQ) return;
    if (selectedRegion === currentQ.region) {
      setScore(s => s + 10);
      setFeedback('correct');
      setTimeout(nextQuestion, 500); // ดีเลย์นิดนึงให้เห็นผล
    } else {
      setFeedback('wrong');
      setTimeout(nextQuestion, 800); // ผิดให้เวลานานหน่อยจะได้จำได้
    }
  };

  // ตัวนับเวลา
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('end');
    }
  }, [timeLeft, gameState]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-earth-200 relative min-h-[400px] flex flex-col items-center justify-center p-6 text-center font-sans">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-earth-100 opacity-30 z-0 pointer-events-none"></div>

      {/* ---------- State: START ---------- */}
      {gameState === 'start' && (
        <div className="z-10 animate-fade-in">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto animate-bounce">
            🎮
          </div>
          <h3 className="text-3xl font-bold text-primary-700 mb-2">ภารกิจพิชิต 4 ภาค</h3>
          <p className="text-gray-600 mb-6 text-lg">ทบทวนความรู้จากการดูงาน<br/>จับคู่ "แนวคิด" ให้ตรงกับ "ภูมิภาค"</p>
          <button 
            onClick={startGame}
            className="px-8 py-3 bg-primary-600 text-white text-xl rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-1 font-bold"
          >
            เริ่มเกมเลย!
          </button>
        </div>
      )}

      {/* ---------- State: PLAYING ---------- */}
      {gameState === 'playing' && currentQ && (
        <div className="w-full z-10">
          <div className="flex justify-between items-center mb-6 text-lg font-bold">
            <div className="bg-white px-4 py-1 rounded-full shadow-sm border text-primary-600">
              คะแนน: {score}
            </div>
            <div className={`px-4 py-1 rounded-full shadow-sm border ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-white text-gray-600'}`}>
              เวลา: {timeLeft}s
            </div>
          </div>

          {/* Question Card */}
          <div className={`bg-white p-8 rounded-2xl shadow-md border-2 border-primary-100 mb-8 transition-all transform ${feedback === 'correct' ? 'scale-105 border-green-500 bg-green-50' : feedback === 'wrong' ? 'shake border-red-500 bg-red-50' : ''}`}>
            <span className="text-sm text-gray-400 uppercase tracking-widest mb-2 block">แนวคิดนี้อยู่ภาคไหน?</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
              "{currentQ.text}"
            </h2>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAnswer('N')} className="p-4 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 font-bold text-xl transition-colors border-2 border-green-200">
              เหนือ (N)
            </button>
            <button onClick={() => handleAnswer('C')} className="p-4 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold text-xl transition-colors border-2 border-yellow-200">
              กลาง (C)
            </button>
            <button onClick={() => handleAnswer('NE')} className="p-4 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold text-xl transition-colors border-2 border-orange-200">
              อีสาน (NE)
            </button>
            <button onClick={() => handleAnswer('S')} className="p-4 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xl transition-colors border-2 border-blue-200">
              ใต้ (S)
            </button>
          </div>
        </div>
      )}

      {/* ---------- State: END ---------- */}
      {gameState === 'end' && (
        <div className="z-10 animate-fade-in">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">จบเกมแล้ว!</h3>
          <p className="text-xl text-gray-600 mb-6">
            คุณทำได้ <span className="text-primary-600 font-bold text-3xl">{score}</span> คะแนน
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={startGame}
              className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-md font-bold"
            >
              เล่นอีกครั้ง
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
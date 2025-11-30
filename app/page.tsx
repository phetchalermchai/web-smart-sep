'use client';

import { useState, useEffect, useRef, SetStateAction } from 'react';
import { marked } from 'marked';
import FieldTripGame from './components/FieldTripGame';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-[30px]');
        }
      });
    }, { threshold: 0.1 });

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Back to Top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowBackToTop(true);
      else setShowBackToTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setExample = (text: SetStateAction<string>) => {
    setAiInput(text);
    if (aiInputRef.current) {
      const y = aiInputRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      aiInputRef.current.focus();
    }
  };

  const askGemini = async () => {
    if (!aiInput.trim()) {
      alert('กรุณาระบุสถานการณ์ของคุณก่อนขอคำแนะนำครับ');
      return;
    }

    setIsLoading(true);
    setAiResult('');
    setError('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      }

      // เช็คว่ามี result กลับมาจริงไหม
      if (!data.result) {
        throw new Error('ไม่ได้รับข้อมูลตอบกลับจาก AI');
      }

      // การใช้ marked แบบถูกต้อง (บาง version ไม่ต้อง await แต่ใส่ไว้ไม่เสียหาย)
      const parsedResult = await marked.parse(data.result);
      setAiResult(parsedResult);

    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // รูปภาพ Gallery 9 รูป
  const fieldTripImages = [
    // ✅ แก้เป็น Link แบบ Direct View แล้ว
    "/images/251130_76.jpg",
    "/images/251130_79.jpg",
    "/images/251130_45.jpg",
    "/images/251130_39.jpg",
    "/images/251130_29.jpg",
    "/images/251130_28.jpg",
    "/images/251130_27.jpg",
    "/images/251130_3.jpg",
    "/images/251130_10.jpg",
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="#" className="text-2xl md:text-3xl font-bold text-primary-700 flex items-center gap-2 z-50">
              <i className="fa-solid fa-leaf text-primary-500"></i>
              <span className="truncate">Smart SEP</span>
            </a>

            <div className="hidden lg:flex space-x-8 font-medium text-xl text-gray-600 items-center">
              <a href="#intro" className="hover:text-primary-600 transition-colors">ทำไมต้อง SEP?</a>
              <a href="#principles" className="hover:text-primary-600 transition-colors">3 ห่วง 2 เงื่อนไข</a>
              <a href="#fieldtrip" className="hover:text-primary-600 transition-colors text-primary-600 font-bold">ศึกษาดูงาน</a>
              {/* <a href="#benefits" className="hover:text-primary-600 transition-colors">ประโยชน์</a> */}
              <a href="#ai-consultant" className="hover:text-primary-600 transition-colors flex items-center gap-1"><i className="fa-solid fa-wand-magic-sparkles text-base"></i> AI ปรึกษางาน</a>
              <a href="#contact" className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 text-lg font-normal">ติดต่อเรา</a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-600 hover:text-primary-600 focus:outline-none z-50">
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'} text-3xl`}></i>
            </button>
          </div>

          <div className={`lg:hidden bg-white border-t border-gray-100 mt-4 -mx-6 px-6 shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex flex-col space-y-4 py-6 font-medium text-xl text-gray-600">
              <a href="#intro" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600">ทำไมต้อง SEP?</a>
              <a href="#principles" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600">3 ห่วง 2 เงื่อนไข</a>
              <a href="#fieldtrip" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600">ศึกษาดูงาน</a>
              <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600">ประโยชน์</a>
              <a href="#ai-consultant" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600 flex items-center gap-2"><i className="fa-solid fa-wand-magic-sparkles text-base"></i> AI ปรึกษางาน</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-primary-600 text-primary-600 font-bold">ติดต่อเรา</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full bg-linear-to-bl from-primary-50 to-transparent opacity-60 z-0 rounded-bl-[100px]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="fade-up opacity-0 translate-y-[30px] transition-all duration-800 inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-base md:text-lg font-semibold mb-6">
            รัฐบาลยุคใหม่ ใส่ใจความยั่งยืน
          </span>
          <h1 className="fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-100 text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-relaxed">
            การประยุกต์ใช้หลัก<br />
            <span className="text-gradient">ปรัชญาเศรษฐกิจพอเพียง</span><br />
            ในการปฏิบัติราชการ
          </h1>
          <p className="fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-200 text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 px-2">
            สร้างภูมิคุ้มกันให้องค์กรและตนเองในยุค VUCA World ด้วยความพอประมาณ มีเหตุผล และมีภูมิคุ้มกัน
          </p>
          <div className="fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-300 flex flex-col md:flex-row justify-center gap-4 px-4">
            <a href="#ai-consultant" className="px-8 py-3 bg-primary-600 text-white text-xl rounded-full hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles"></i> ปรึกษา AI
            </a>
            <a href="#fieldtrip" className="px-8 py-3 border border-gray-300 text-gray-600 text-xl rounded-full hover:border-primary-500 hover:text-primary-600 transition-all bg-white text-center">
              ศึกษาดูงาน
            </a>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section id="intro" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="w-full lg:w-1/2 relative fade-up opacity-0 translate-y-[30px] transition-all duration-800">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Compass" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-linear-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white text-xl font-bold drop-shadow-md">
                  เข็มทิศแห่งความยั่งยืน
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-200">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-relaxed">ทำไมต้องเศรษฐกิจพอเพียง?</h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                ในสภาวะโลกที่เปลี่ยนแปลงเร็ว การทำงานราชการต้องการ <span className="text-primary-600 font-bold">"เข็มทิศ"</span> ที่ช่วยในการตัดสินใจที่ถูกต้อง เพื่อสร้างสมดุลระหว่างชีวิตและการทำงาน
              </p>
              <ul className="space-y-4 text-gray-700 text-lg">
                <li className="flex items-center gap-3"><i className="fa-solid fa-check-circle text-primary-500 text-2xl"></i> สร้างความโปร่งใสและตรวจสอบได้</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check-circle text-primary-500 text-2xl"></i> ลดความเสี่ยงและสร้างภูมิคุ้มกัน</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check-circle text-primary-500 text-2xl"></i> บริหารทรัพยากรอย่างคุ้มค่า</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Principles (3 Rings) */}
      <section id="principles" className="py-16 md:py-24 bg-primary-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-relaxed">หลัก 3 ห่วง (3 Principles)</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 transition-all duration-300 fade-up opacity-0 translate-y-[30px]">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-6 mx-auto">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">ความพอประมาณ</h3>
              <p className="text-lg text-center text-gray-600">ปฏิบัติหน้าที่อย่างพอดี ไม่ตึงหรือหย่อนเกินไป ใช้งบประมาณคุ้มค่า</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 transition-all duration-300 fade-up opacity-0 translate-y-[30px] delay-100">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-6 mx-auto">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">ความมีเหตุผล</h3>
              <p className="text-lg text-center text-gray-600">ตัดสินใจบนฐานกฎหมายและข้อมูลวิชาการ คำนึงถึงประโยชน์ส่วนรวม</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:-translate-y-2 transition-all duration-300 fade-up opacity-0 translate-y-[30px] delay-200">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl mb-6 mx-auto">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">การมีภูมิคุ้มกัน</h3>
              <p className="text-lg text-center text-gray-600">บริหารความเสี่ยง มีแผนสำรอง ป้องกันการทุจริต</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions (2 Conditions) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-primary-900 rounded-3xl p-8 md:p-16 text-white shadow-2xl overflow-hidden relative fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center relative z-10 leading-relaxed">2 เงื่อนไข: ฐานรากของการปฏิบัติงาน</h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative z-10">
              <div className="flex gap-4 md:gap-6">
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary-700 flex items-center justify-center text-xl md:text-2xl">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary-100">เงื่อนไขความรู้</h3>
                  <ul className="space-y-3 opacity-90 text-base md:text-lg">
                    <li>- รู้กฎหมายและระเบียบปฏิบัติอย่างถ่องแท้</li>
                    <li>- หมั่นศึกษาเพิ่มเติม (Continuous Learning)</li>
                    <li>- ใช้ข้อมูลจริงในการวางแผน (Data-driven)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4 md:gap-6">
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary-700 flex items-center justify-center text-xl md:text-2xl">
                  <i className="fa-solid fa-heart"></i>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary-100">เงื่อนไขคุณธรรม</h3>
                  <ul className="space-y-3 opacity-90 text-base md:text-lg">
                    <li>- ซื่อสัตย์สุจริต (Integrity)</li>
                    <li>- ขยัน อดทน เพียรพยายาม</li>
                    <li>- ไม่เบียดเบียนประชาชน แบ่งปัน</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Field Trip (Study Visit) - Updated Content */}
      <section id="fieldtrip" className="py-16 md:py-24 bg-earth-100 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <span className="text-earth-800 font-bold tracking-wider uppercase text-sm md:text-base bg-white px-3 py-1 rounded-full shadow-sm">
              <i className="fa-solid fa-map-location-dot mr-2"></i>ศึกษาดูงาน
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-earth-800 mt-4 leading-relaxed">ศูนย์ภูมิรักษ์ธรรมชาติ จ.นครนายก</h2>
            <p className="text-lg md:text-xl text-gray-600 mt-2">เรียนรู้จากการลงมือทำจริง ตามรอยพ่อ</p>
          </div>

          {/* 4 Key Concepts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-yellow-600 fade-up opacity-0 translate-y-[30px] delay-100">
              <div className="text-yellow-600 text-3xl mb-3"><i className="fa-solid fa-layer-group"></i></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. ดิน</h3>
              <p className="text-base text-gray-600">อย่าปอกเปลือก เปลือยดิน ให้ "ห่มดิน" เพื่อรักษาความชื้นและหน้าดิน</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-500 fade-up opacity-0 translate-y-[30px] delay-200">
              <div className="text-blue-500 text-3xl mb-3"><i className="fa-solid fa-water"></i></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. น้ำ</h3>
              <p className="text-base text-gray-600">ขุดบ่อน้ำ ฝายชะลอน้ำ และขุด "คลองไส้ไก่" เพื่อกระจายความชุ่มชื้น</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-green-600 fade-up opacity-0 translate-y-[30px] delay-300">
              <div className="text-green-600 text-3xl mb-3"><i className="fa-solid fa-tree"></i></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. ป่า</h3>
              <p className="text-base text-gray-600">ปลูกป่า 3 อย่าง ประโยชน์ 4 อย่าง และปลูกป่า 5 ชั้น (สูง กลาง เตี้ย เรี่ยดิน ใต้ดิน)</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-orange-500 fade-up opacity-0 translate-y-[30px] delay-400">
              <div className="text-orange-500 text-3xl mb-3"><i className="fa-solid fa-user-graduate"></i></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">4. ฅน</h3>
              <p className="text-base text-gray-600">ต้องมีความรู้ คู่ความเพียร มีปัญญาและความอดทน</p>
            </div>
          </div>

          {/* Motto Quote */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg text-center mb-16 relative overflow-hidden fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-yellow-400 via-green-500 to-blue-500"></div>
            <i className="fa-solid fa-quote-left text-4xl text-gray-200 absolute top-6 left-6"></i>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed z-10 relative">
              "เดินทีละก้าว กินข้าวทีละคำ ทำทีละอย่าง"
            </h3>
            <p className="text-lg md:text-xl text-gray-600 mt-4 z-10 relative">
              ความขาดแคลน ไม่เป็นปัญหา ถ้ามีปัญญา และความอดทน
            </p>
          </div>

          {/* 4 Regions Knowledge */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center fade-up opacity-0 translate-y-[30px] transition-all duration-800">พิพิธภัณฑ์ธรรมชาติมีชีวิต (4 ภาค)</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0 text-xl font-bold">N</div>
                <div>
                  <h4 className="text-xl font-bold text-green-800 mb-2">ภาคเหนือ</h4>
                  <ul className="text-base text-gray-600 list-disc list-inside">
                    <li>ป่า 3 อย่าง ประโยชน์ 4 อย่าง</li>
                    <li>ป่าเปียกกันไฟ</li>
                    <li>ฝายชะลอความชุ่มชื้น</li>
                    <li>ปลูกต้นไม้ในใจคน</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 shrink-0 text-xl font-bold">C</div>
                <div>
                  <h4 className="text-xl font-bold text-yellow-800 mb-2">ภาคกลาง</h4>
                  <ul className="text-base text-gray-600 list-disc list-inside">
                    <li>เกษตรทฤษฎีใหม่</li>
                    <li>การจัดสรรที่ดินและแหล่งน้ำ</li>
                    <li>การอยู่อาศัยแบบพอเพียง</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 shrink-0 text-xl font-bold">NE</div>
                <div>
                  <h4 className="text-xl font-bold text-orange-800 mb-2">ภาคอีสาน</h4>
                  <ul className="text-base text-gray-600 list-disc list-inside">
                    <li>การเกษตรที่ใช้น้ำน้อย</li>
                    <li>การส่งเสริมอาชีพ</li>
                    <li>ธนาคารข้าว</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 shrink-0 text-xl font-bold">S</div>
                <div>
                  <h4 className="text-xl font-bold text-blue-800 mb-2">ภาคใต้</h4>
                  <ul className="text-base text-gray-600 list-disc list-inside">
                    <li>โครงการแก้มลิง / แกล้งดิน</li>
                    <li>การบำบัดน้ำเสีย</li>
                    <li>กังหันน้ำชัยพัฒนา</li>
                    <li>พลังงานทดแทน (ลม/แสงแดด)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery (9 Photos) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-up opacity-0 translate-y-[30px] transition-all duration-800 mb-12">
            {fieldTripImages.map((src, index) => (
              <div key={index} className="overflow-hidden rounded-xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`ดูงาน ${index + 1}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>

          {/* Location Map */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <h3 className="text-2xl font-bold text-earth-800 mb-4 text-center">
              <i className="fa-solid fa-map-marked-alt mr-2"></i>การเดินทาง
            </h3>
            <p className="text-center text-gray-600 mb-6">
              98/1 หมู่ 2 ตำบลหินตั้ง อำเภอเมือง จังหวัดนครนายก 26000
            </p>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-inner">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src="https://maps.google.com/maps?q=ศูนย์ภูมิรักษ์ธรรมชาติ+นครนายก&t=&z=15&ie=UTF8&iwloc=&output=embed">
              </iframe>
            </div>
            <div className="text-center mt-6">
              <a href="https://maps.app.goo.gl/rU6w3ZMs1aJaxcfx7" target="_blank" className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-bold text-lg">
                <i className="fa-solid fa-location-arrow mr-2"></i>นำทางผ่าน Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Field Trip Section */}
      <section id="fieldtrip" className="py-16 md:py-24 bg-earth-100 relative">
        <div className="container mx-auto px-6">
            {/* ... (เนื้อหา Text / Grid / Map เดิม) ... */}

            {/* 👇👇 เพิ่มส่วนเกมตรงนี้ (ต่อจาก Map) 👇👇 */}
            <div className="mt-16 fade-up">
                <div className="text-center mb-8">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-bold">Mini Game</span>
                    <h3 className="text-2xl font-bold text-earth-800 mt-2">ทดสอบความรู้: ภารกิจพิชิต 4 ภาค</h3>
                </div>
                <FieldTripGame />
            </div>

        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-relaxed">ประโยชน์ที่คาดว่าจะได้รับ</h2>
            <p className="text-lg text-gray-500 mt-2">ผลลัพธ์ของการน้อมนำปรัชญาเศรษฐกิจพอเพียงมาปรับใช้</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Individual */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-primary-500 hover:shadow-lg transition-all duration-300 group fade-up opacity-0 translate-y-[30px] delay-100">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                <i className="fa-solid fa-user-tie text-3xl text-gray-400 group-hover:text-primary-600"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">ระดับบุคคล</h3>
              <p className="text-base md:text-lg text-gray-600">
                บุคลากรมีความสุขในการทำงาน มีเกียรติศักดิ์ศรี ปลอดหนี้สิน มีภูมิคุ้มกันในการดำเนินชีวิต และมีความมั่นคงในอาชีพ
              </p>
            </div>

            {/* Organization */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-primary-500 hover:shadow-lg transition-all duration-300 group fade-up opacity-0 translate-y-[30px] delay-200">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                <i className="fa-solid fa-building-columns text-3xl text-gray-400 group-hover:text-primary-600"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">ระดับองค์กร</h3>
              <p className="text-base md:text-lg text-gray-600">
                องค์กรมีประสิทธิภาพ ใช้งบประมาณคุ้มค่า ลดการรั่วไหล สร้างวัฒนธรรมองค์กรที่โปร่งใส และมีภาพลักษณ์ที่ดี
              </p>
            </div>

            {/* Public */}
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:border-primary-500 hover:shadow-lg transition-all duration-300 group fade-up opacity-0 translate-y-[30px] delay-300">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                <i className="fa-solid fa-users text-3xl text-gray-400 group-hover:text-primary-600"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">ต่อประชาชน</h3>
              <p className="text-base md:text-lg text-gray-600">
                ได้รับบริการที่รวดเร็ว เสมอภาค เป็นธรรม ประชาชนมีความเชื่อมั่นและศรัทธาในการทำงานของภาครัฐ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Consultant Section */}
      <section id="ai-consultant" className="py-16 md:py-24 bg-linear-to-b from-white to-primary-50 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-10 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-100 text-primary-700 text-base font-semibold mb-4">
              <i className="fa-solid fa-wand-magic-sparkles"></i> AI by น้องพอเพียง
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-relaxed">ปรึกษาปัญหาการงานวิถีพอเพียง</h2>
            <p className="text-gray-600 mt-4 text-xl max-w-3xl mx-auto">
              พิมพ์สถานการณ์ หรือปัญหาในการทำงานของคุณลงไป AI จะช่วยวิเคราะห์และเสนอแนะแนวทางแก้ไขตามหลัก 3 ห่วง 2 เงื่อนไข
            </p>
          </div>

          <div className="max-w-4xl mx-auto fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-100">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
              <label htmlFor="ai-input" className="block text-gray-700 font-semibold mb-3 text-xl">ระบุสถานการณ์ของคุณ:</label>
              <textarea
                id="ai-input"
                ref={aiInputRef}
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all resize-none text-gray-700 placeholder-gray-400 text-lg"
                placeholder="ตัวอย่าง: ได้รับมอบหมายให้จัดโครงการอบรม แต่มีงบประมาณจำกัดมาก และเวลากระชั้นชิด..."
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              ></textarea>

              {/* Quick Prompts */}
              <div className="mt-4 mb-2">
                <p className="text-base text-gray-500 mb-3 font-semibold">ตัวอย่างคำถาม (กดเพื่อเลือก):</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setExample('ต้องวางแผนยุทธศาสตร์ระยะยาว 5 ปี แต่ข้อมูลสถิติย้อนหลังมีไม่ครบถ้วน และสถานการณ์โลกผันผวน จะใช้หลักความมีเหตุผลและภูมิคุ้มกันอย่างไร?')}
                    className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-primary-100 text-primary-700 rounded-lg text-base transition-colors border border-gray-200 text-left">
                    <i className="fa-solid fa-chart-line mr-1"></i> นักวิเคราะห์นโยบาย
                  </button>
                  <button onClick={() => setExample('ได้รับงบประมาณจัดซื้อครุภัณฑ์มาน้อยกว่าที่ตั้งไว้มาก แต่หน่วยงานมีความจำเป็นต้องใช้ของด่วน จะบริหารจัดการอย่างไรให้คุ้มค่าและโปร่งใส?')}
                    className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-primary-100 text-primary-700 rounded-lg text-base transition-colors border border-gray-200 text-left">
                    <i className="fa-solid fa-coins mr-1"></i> นักวิชาการเงิน
                  </button>
                  <button onClick={() => setExample('ต้องทำการทดลองวิจัยที่มีความเสี่ยงสูงและสารเคมีราคาแพง จะนำหลักความพอประมาณมาใช้ลดต้นทุนและความเสี่ยงได้อย่างไร?')}
                    className="px-4 py-2 bg-gray-100 cursor-pointer hover:bg-primary-100 text-primary-700 rounded-lg text-base transition-colors border border-gray-200 text-left">
                    <i className="fa-solid fa-flask mr-1"></i> นักวิทยาศาสตร์
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={askGemini}
                  disabled={isLoading}
                  className={`px-8 py-3 bg-primary-600 cursor-pointer text-white rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 flex items-center gap-2 text-lg font-bold ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <span>{isLoading ? 'กำลังวิเคราะห์...' : 'ขอคำแนะนำ ✨'}</span>
                </button>
              </div>
            </div>

            {/* Result Area */}
            {(aiResult || isLoading || error) && (
              <div className="bg-white rounded-2xl shadow-xl border-t-4 border-primary-500 p-8 relative overflow-hidden mt-8 animate-fade-in">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <i className="fa-solid fa-robot text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">คำแนะนำจาก AI น้องพอเพียง</h3>
                </div>

                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 animate-pulse text-lg">กำลังวิเคราะห์...</p>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-lg bg-red-50 p-4 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                {aiResult && !isLoading && (
                  <div
                    className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: aiResult }}
                  ></div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section id="checklist" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-relaxed">Checklist ประจำวัน</h2>
            <p className="text-xl text-gray-500 mt-2">สำรวจตนเองเพื่อสร้างนิสัยข้าราชการที่ดี</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 fade-up opacity-0 translate-y-[30px] transition-all duration-800 delay-100">
            <div className="space-y-4">
              <label className="custom-checkbox flex items-center gap-4 cursor-pointer group p-4 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-100">
                {/* ✅ Fix: Using peer-checked on div to control child SVG display */}
                <input type="checkbox" className="peer hidden" />
                <div className="w-8 h-8 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white group-hover:border-primary-500 peer-checked:bg-primary-500 peer-checked:border-primary-500 peer-checked:[&_svg]:block shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">วันนี้ฉันทำงานคุ้มค่าหรือไม่?</h4>
                  <p className="text-base text-gray-500">ด้านความพอประมาณ</p>
                </div>
              </label>
              <label className="custom-checkbox flex items-center gap-4 cursor-pointer group p-4 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-100">
                <input type="checkbox" className="peer hidden" />
                <div className="w-8 h-8 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white group-hover:border-primary-500 peer-checked:bg-primary-500 peer-checked:border-primary-500 peer-checked:[&_svg]:block shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">การตัดสินใจมีเหตุผลรองรับไหม?</h4>
                  <p className="text-base text-gray-500">ด้านความมีเหตุผล</p>
                </div>
              </label>
              <label className="custom-checkbox flex items-center gap-4 cursor-pointer group p-4 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-100">
                <input type="checkbox" className="peer hidden" />
                <div className="w-8 h-8 border-2 border-gray-300 rounded-md flex items-center justify-center bg-white group-hover:border-primary-500 peer-checked:bg-primary-500 peer-checked:border-primary-500 peer-checked:[&_svg]:block shrink-0 transition-colors">
                  <svg className="w-6 h-6 text-white hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">พร้อมรับมือกับปัญหาหรือไม่?</h4>
                  <p className="text-base text-gray-500">ด้านภูมิคุ้มกัน</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white pt-16 pb-10" id="contact">
        <div className="container mx-auto px-6 text-center">
          <i className="fa-solid fa-quote-left text-3xl md:text-5xl text-primary-500 mb-6 opacity-50"></i>
          <h2 className="text-2xl md:text-4xl font-medium leading-relaxed max-w-4xl mx-auto mb-8 fade-up opacity-0 translate-y-[30px] transition-all duration-800">
            "เศรษฐกิจพอเพียง" ไม่ใช่ทางเลือก แต่เป็น <span className="text-primary-400">"ทางรอด"</span><br />
            นำพาประเทศไปสู่ความ มั่นคง มั่งคั่ง และยั่งยืน
          </h2>
          <div className="w-16 md:w-24 h-1 bg-primary-600 mx-auto rounded-full mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8 text-left border-t border-primary-800 pt-10">
            <div>
              <h4 className="font-bold text-xl mb-4 text-primary-200">เกี่ยวกับเรา</h4>
              <p className="text-base text-gray-400">โครงการส่งเสริมธรรมาภิบาลและการพัฒนาข้าราชการตามแนวทางปรัชญาเศรษฐกิจพอเพียง</p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4 text-primary-200">เมนูลัด</h4>
              <div className="flex flex-col space-y-2 text-base text-gray-400">
                <a href="#principles" className="hover:text-white">หลักการ 3 ห่วง</a>
                <a href="#checklist" className="hover:text-white">แบบประเมินตนเอง</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4 text-primary-200">Q & A</h4>
              <p className="text-base text-gray-400 mb-4">แลกเปลี่ยนความคิดเห็น / สอบถามข้อมูลเพิ่มเติม</p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/MHESIThailand" target="_blank" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                <a href="https://www.youtube.com/user/ScienceThailand" target="_blank" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><i className="fa-brands fa-youtube text-lg"></i></a>
                <a href="mailto:mcs@mhesi.go.th" className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center hover:bg-primary-600 transition-colors"><i className="fa-solid fa-envelope text-lg"></i></a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-primary-200">
            &copy; 2025 กลุ่ม 5 ต้นกล้าข้าราชการ อว. รุ่น 2
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-50 cursor-pointer bg-primary-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 focus:outline-none transition-all duration-300 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  LightBulbIcon,
  PaintBrushIcon,
  SparklesIcon,
  WandSparklesIcon,
  CheckIcon,
  ArrowRightLeftIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon
} from './icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const BeforeAfterSlider: React.FC = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const imageContainer = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (!imageContainer.current) return;
        const rect = imageContainer.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };
    
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const container = imageContainer.current;
        if (container) {
             container.addEventListener('mouseup', handleMouseUp);
             container.addEventListener('mouseleave', handleMouseUp);
        }
        return () => {
             if (container) {
                container.removeEventListener('mouseup', handleMouseUp);
                container.removeEventListener('mouseleave', handleMouseUp);
             }
        }
    }, [isDragging]);


    return (
        <div 
          ref={imageContainer}
          className="relative w-full max-w-2xl mx-auto aspect-[4/5] overflow-hidden rounded-2xl select-none cursor-ew-resize shadow-2xl"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={handleMouseUp}
        >
            <img 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                src="https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg"
                alt="Before" 
            />
            <div 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none overflow-hidden" 
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg"
                    alt="After" 
                />
            </div>
            
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `calc(${sliderPosition}% - 1px)` }}
            >
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -ml-5 bg-white h-10 w-10 rounded-full shadow-md grid place-items-center"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                    <ArrowRightLeftIcon className="w-5 h-5 text-slate-700" />
                </div>
            </div>
        </div>
    );
};

const FAQItem: React.FC<{ q: string; children: React.ReactNode; isOpen: boolean; onClick: () => void }> = ({ q, children, isOpen, onClick }) => (
    <div className="border-b border-slate-200 py-4">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left text-lg font-medium text-slate-800 hover:text-indigo-600"
        >
            <span>{q}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <p className="text-slate-600">{children}</p>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const faqs = [
      { q: "Is my data and photo kept private?", a: "Absolutely. We prioritize your privacy. Your photos are only used for the AI analysis and are not stored or shared. All processing is secure and confidential." },
      { q: "What kind of photo should I upload?", a: "For the best results, upload a clear, full-body photo where your entire outfit is visible. Good lighting and a simple background help our AI focus on your style." },
      { q: "How does the virtual try-on work?", a: "Our advanced AI model analyzes your photo and the suggested clothing items. It then generates a new, hyper-realistic image of you wearing the outfit, matching your pose, body shape, and the original lighting." },
      { q: "Is Roopix AI free to use?", a: "Yes, you can get your initial set of AI-powered style suggestions and try on outfits completely free. We may introduce premium features in the future." },
  ];

  return (
    <div className="w-full animate-fade-in bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-indigo-100 text-indigo-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">Welcome to the Future of Fashion</span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tighter">
                Your Personal AI Stylist
              </h1>
              <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-slate-600 mb-8">
                Tired of guessing what to wear? Get instant, personalized outfit recommendations and virtually try them on with our groundbreaking AI technology.
              </p>
              <button
                onClick={onGetStarted}
                className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-transform hover:scale-105 transform shadow-lg flex items-center justify-center mx-auto lg:mx-0"
              >
                Discover My Style
                <ChevronRightIcon className="w-6 h-6 ml-2" />
              </button>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-slate-500">
                  <div className="flex items-center"><CheckIcon className="w-5 h-5 mr-2 text-indigo-500"/> Personal Curation</div>
                  <div className="flex items-center"><CheckIcon className="w-5 h-5 mr-2 text-indigo-500"/> Virtual Try-On</div>
                  <div className="flex items-center"><CheckIcon className="w-5 h-5 mr-2 text-indigo-500"/> Free to Start</div>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
                 <div className="relative bg-slate-800 p-4 sm:p-6 rounded-[2rem] shadow-2xl w-[300px] h-[600px]">
                    <div className="w-full h-full bg-slate-700 rounded-[1.5rem] flex items-center justify-center">
                        <img src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg" alt="App Preview" className="w-full h-full object-cover rounded-[1.5rem]" />
                    </div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                    </div>
                 </div>
            </div>
        </div>
      </section>

       {/* Feature Spotlight Section */}
        <section className="py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">See The Magic Happen</h2>
                 <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2 mb-12">
                     Slide to see a real example of our virtual try-on. It's not just an edit, it's a transformation.
                 </p>
                 <BeforeAfterSlider />
            </div>
        </section>

      {/* How It Works Section */}
        <section className="py-20 lg:py-24 bg-slate-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Your Style Journey in 4 Steps</h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2">
                      From a simple photo to a stunning new look, the process is seamless.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <div className="text-center p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/8106/8106979.png" alt="Upload Icon" className="w-24 h-24 mx-auto mb-4"/>
                        <p className="text-sm font-semibold text-indigo-600 mb-2">STEP 1</p>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Photo</h3>
                        <p className="text-slate-500">Choose a clear, full-body photo to begin.</p>
                     </div>
                     <div className="text-center p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png" alt="Select Icon" className="w-24 h-24 mx-auto mb-4"/>
                        <p className="text-sm font-semibold text-indigo-600 mb-2">STEP 2</p>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Define Context</h3>
                        <p className="text-slate-500">Select the season and occasion for your look.</p>
                     </div>
                     <div className="text-center p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/9036/9036730.png" alt="Review Icon" className="w-24 h-24 mx-auto mb-4"/>
                        <p className="text-sm font-semibold text-indigo-600 mb-2">STEP 3</p>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Get Suggestions</h3>
                        <p className="text-slate-500">Our AI curates three distinct outfits for you.</p>
                     </div>
                     <div className="text-center p-6 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                        <img src="https://cdn-icons-png.flaticon.com/512/9525/9525049.png" alt="Try-On Icon" className="w-24 h-24 mx-auto mb-4"/>
                        <p className="text-sm font-semibold text-indigo-600 mb-2">STEP 4</p>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Virtual Try-On</h3>
                        <p className="text-slate-500">See the curated styles on your own photo.</p>
                     </div>
                </div>
            </div>
        </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <QuestionMarkCircleIcon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-2">
                    Have questions? We've got answers.
                </p>
            </div>
            <div>
                {faqs.map((faq, index) => (
                    <FAQItem key={index} q={faq.q} isOpen={openFAQ === index} onClick={() => setOpenFAQ(openFAQ === index ? null : index)}>
                        {faq.a}
                    </FAQItem>
                ))}
            </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
             <div className="absolute -bottom-16 -right-5 w-40 h-40 bg-white/10 rounded-full"></div>
             <div className="relative">
                 <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ready to Discover Your Best Look?</h2>
                 <p className="max-w-2xl mx-auto text-lg text-indigo-100 mt-4 mb-8">
                   Your style evolution starts here. Get personalized, AI-driven fashion advice today.
                 </p>
                 <button 
                    onClick={onGetStarted} 
                    className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-slate-100 transition-transform hover:scale-105 transform shadow-lg"
                >
                  Start My Transformation
                </button>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
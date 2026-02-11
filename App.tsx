import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Widget } from './components/Widget';
import { CopyButton } from './components/CopyButton';
import { formatCurrency } from './utils';
import { FinancialItem } from './types';

const MapContainer: React.FC<{ title: string; embedUrl: string; externalUrl: string }> = ({ title, embedUrl, externalUrl }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex-1 min-h-[200px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group bg-slate-950/50">
      {!isActive ? (
        <div 
          onClick={() => setIsActive(true)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 backdrop-blur-[2px] hover:bg-slate-900/20 transition-all duration-500"
        >
          <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-location-dot text-sky-500"></i>
          </div>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-sky-400 transition-colors">Ativar Mapa Interativo</p>
        </div>
      ) : (
        <button 
          onClick={() => setIsActive(false)}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      )}
      
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <i className="fa-solid fa-map text-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12"></i>
      </div>

      {isActive && (
        <iframe 
          title={title}
          className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 relative z-10"
          src={embedUrl}
          loading="lazy"
          allowFullScreen
        ></iframe>
      )}

      <a 
        href={externalUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-20 flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-lg text-[9px] font-black uppercase text-slate-300 hover:text-white hover:bg-sky-500/20 hover:border-sky-500/40 transition-all"
      >
        <i className="fa-solid fa-up-right-from-square"></i>
        Abrir no Maps
      </a>
    </div>
  );
};

const App: React.FC = () => {
  const [images, setImages] = useState<{url: string, caption: string, isAI: boolean}[]>([
    { url: 'https://images.unsplash.com/photo-1583922606661-0822ed0bd916?auto=format&fit=crop&q=80&w=800', caption: 'Andorra Slopes', isAI: false },
    { url: 'https://images.unsplash.com/photo-1539103831417-946024b129c1?auto=format&fit=crop&q=80&w=800', caption: 'Barcelona Gothic Quarter', isAI: false },
    { url: 'https://images.unsplash.com/photo-1549927681-0b673b8243ab?auto=format&fit=crop&q=80&w=800', caption: 'La Rambla Night', isAI: false },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const PAID_ITEMS: FinancialItem[] = [
    { id: '1', description: 'Pacote Snowpack', value: '1.100,00', currency: 'EUR', isPaid: true },
    { id: '2', description: 'Passagem Aérea', value: '4.170,82', currency: 'BRL', isPaid: true },
    { id: '3', description: 'Hotel Barcelona (BCN)', value: '972,56', currency: 'BRL', isPaid: true },
    { id: '4', description: 'Seguro Viagem', value: '318,43', currency: 'BRL', isPaid: true },
  ];

  const PENDING_ITEMS: FinancialItem[] = [
    { id: '5', description: 'Bagagem Prancha (€100 ida / €100 volta)', value: '200,00', currency: 'EUR', isPaid: false },
    { id: '6', description: 'Transfer Privativo (Sua Parte)', value: '31,25', currency: 'EUR', isPaid: false },
    { id: '7', description: 'Taxa Turística BCN', value: '68,61', currency: 'BRL', isPaid: false },
    { id: '8', description: 'Estacionamento GRU', value: '630,00', currency: 'BRL', isPaid: false },
  ];

  const generateAIMemory = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompts = [
        "A cinematic high-quality photo of a snowboarder carving through fresh powder on the sunny slopes of Grandvalira, Andorra, mountain peak in background.",
        "A futuristic night shot of La Sagrada Familia in Barcelona with neon light accents and a cinematic atmosphere.",
        "A wide-angle landscape of Pas de la Casa, Andorra, covered in deep snow under a starry night sky, cozy lights from the village."
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: randomPrompt }] },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const newUrl = `data:image/png;base64,${base64Data}`;
          setImages(prev => [{ url: newUrl, caption: 'AI Generated Memory', isAI: true }, ...prev]);
        }
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-7xl mx-auto selection:bg-sky-500/30">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-sky-500 rounded-full hidden md:block"></div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
              EuroTrip <span className="text-sky-500 not-italic">2026</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Wandir Junior Rondon &bull; Command Center Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Status do Passaporte</p>
            <p className="text-emerald-400 text-xs font-bold uppercase">Validado & Verificado</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 relative z-10">Electronic Travel Doc</span>
            <div className="flex items-center gap-4 relative z-10">
              <span className="text-sky-400 font-mono font-bold text-2xl tracking-[0.2em]">GL065438</span>
              <i className="fa-solid fa-qrcode text-slate-700 text-xl group-hover:text-sky-500 transition-colors"></i>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">
        
        {/* Row 1: Top Critical Stats */}
        <div className="md:col-span-4 lg:col-span-4">
          <Widget 
            title="Segurança & Saúde" 
            icon="fa-solid fa-shield-heart" 
            accentColor="rose"
            footer={<span className="text-slate-500 font-bold">COBERTURA INTERNACIONAL ATIVA</span>}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-widest">Seguradora</p>
                  <p className="text-white font-black text-xl tracking-tight">Porto Seguro</p>
                </div>
                <div className="bg-rose-500/10 p-2 rounded-lg">
                  <i className="fa-solid fa-user-shield text-rose-500 text-xl"></i>
                </div>
              </div>
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 group hover:border-rose-500/30 transition-colors">
                <p className="text-slate-500 text-[9px] uppercase font-black mb-2 tracking-widest">Apólice / VOUCHER</p>
                <CopyButton text="26.1369.238484838" className="w-full justify-between bg-transparent border-0 p-0" />
              </div>
              <a 
                href="tel:+551133663377" 
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]"
              >
                <i className="fa-solid fa-phone-volume"></i>
                <span className="font-black uppercase text-xs tracking-widest">+55 11 3366 3377</span>
              </a>
            </div>
          </Widget>
        </div>

        {/* Flight Outbound */}
        <div className="md:col-span-4 lg:col-span-4">
          <Widget title="Flight Outbound" icon="fa-solid fa-plane-departure" accentColor="sky">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <img src="https://www.google.com/s2/favicons?domain=ita-airways.com&sz=32" alt="ITA" className="w-5 h-5 rounded-sm" />
                  <span className="text-xs font-black text-white">AZ 675</span>
                </div>
                <CopyButton text="ACZPXU" label="LOC: ACZPXU" className="text-[10px] bg-sky-500/10 border-sky-500/20 text-sky-400 font-bold" />
              </div>

              <div className="relative space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-white">GRU</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">São Paulo</p>
                  </div>
                  <div className="text-center flex-1 px-4 pt-2">
                    <div className="relative h-px bg-slate-800 w-full mb-1">
                      <i className="fa-solid fa-plane text-[10px] text-sky-500 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2"></i>
                    </div>
                    <p className="text-[9px] font-bold text-slate-600">11h 20m</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-white">FCO</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Roma</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-black">
                  <span className="text-sky-500">26/02 @ 20:40</span>
                  <span className="text-slate-400">27/02 @ 12:00</span>
                </div>

                <div className="my-4 py-3 px-4 rounded-xl bg-sky-500/5 border border-dashed border-sky-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-hourglass-half text-sky-400 text-[10px]"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Layover in FCO</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase">10h 00m</span>
                </div>

                <div className="flex justify-between items-start opacity-80">
                  <div><h4 className="text-xl font-black text-slate-300">FCO</h4></div>
                  <div className="text-center flex-1 px-4 pt-2">
                    <div className="relative h-px bg-slate-800 w-full mb-1">
                      <i className="fa-solid fa-plane text-[8px] text-slate-600 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2"></i>
                    </div>
                  </div>
                  <div className="text-right"><h4 className="text-xl font-black text-slate-300">BCN</h4></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">27/02 @ 22:00</span>
                  <span className="text-emerald-500">27/02 @ 23:55</span>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* Flight Inbound */}
        <div className="md:col-span-4 lg:col-span-4">
          <Widget title="Flight Inbound" icon="fa-solid fa-plane-arrival" accentColor="sky">
             <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <img src="https://www.google.com/s2/favicons?domain=ita-airways.com&sz=32" alt="ITA" className="w-5 h-5 rounded-sm" />
                  <span className="text-xs font-black text-white">AZ 74 | AZ 674</span>
                </div>
                <CopyButton text="ACZPXU" label="LOC: ACZPXU" className="text-[10px] bg-sky-500/10 border-sky-500/20 text-sky-400 font-bold" />
              </div>

              <div className="relative space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-white">BCN</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Barcelona</p>
                  </div>
                  <div className="text-center flex-1 px-4 pt-2">
                    <div className="relative h-px bg-slate-800 w-full mb-1">
                      <i className="fa-solid fa-plane text-[10px] text-sky-500 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2"></i>
                    </div>
                    <p className="text-[9px] font-bold text-slate-600">1h 50m</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-black text-white">FCO</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Roma</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-black">
                  <span className="text-sky-500">08/03 @ 16:50</span>
                  <span className="text-slate-400">08/03 @ 18:40</span>
                </div>

                <div className="my-4 py-3 px-4 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-bed text-amber-500 text-[10px]"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Overnight in FCO</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase">13h 20m</span>
                </div>

                <div className="flex justify-between items-start opacity-80">
                  <div><h4 className="text-xl font-black text-slate-300">FCO</h4></div>
                  <div className="text-center flex-1 px-4 pt-2">
                    <div className="relative h-px bg-slate-800 w-full mb-1">
                      <i className="fa-solid fa-plane text-[8px] text-slate-600 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2"></i>
                    </div>
                  </div>
                  <div className="text-right"><h4 className="text-xl font-black text-slate-300">GRU</h4></div>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-400">09/03 @ 08:00</span>
                  <span className="text-emerald-500">09/03 @ 15:55</span>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* Row 2: Maps & Logistics */}
        <div className="md:col-span-12 lg:col-span-8">
          <Widget title="Hospedagem & Localização" icon="fa-solid fa-map-location-dot" accentColor="slate">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Barcelona */}
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Barcelona &bull; 08002</span>
                    <CopyButton text="La Rambla, 70" label="Copiar Endereço" className="text-[10px]" />
                  </div>
                  <h4 className="font-black text-white text-lg leading-none mb-1 uppercase tracking-tight">Hotel Flor Parks</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Situação central em La Rambla.</p>
                </div>
                <MapContainer 
                  title="Map Barcelona"
                  embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.6841243765126!2d2.1706686156172674!3d41.38133397926442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a2f80c609c1b%3A0xc3f58e3e48e0255!2sHotel%20Flor%20Parks!5e0!3m2!1sen!2sbr!4v1700000000000!5m2!1sen!2sbr"
                  externalUrl="https://maps.app.goo.gl/3rP4N4h2w1wY6J4A8"
                />
              </div>

              {/* Andorra */}
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pas de la Casa &bull; Andorra</span>
                    <CopyButton text="Carrer de Consuegra 2-72" label="Copiar Endereço" className="text-[10px]" />
                  </div>
                  <h4 className="font-black text-white text-lg leading-none mb-1 uppercase tracking-tight">Apto Consuegra</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <i className="fa-solid fa-key text-[10px] text-amber-500"></i>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-in: <span className="text-white">Immodelpas</span></p>
                  </div>
                </div>
                <MapContainer 
                  title="Map Andorra"
                  embedUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.473528249673!2d1.728864015647565!3d42.54146097917452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12af8a3e7306236b%3A0x6d9f8f3c6d9f8f3c!2sCarrer%20de%20Consuegra%2C%202-72%2C%20AD200%20Pas%20de%20la%20Casa%2C%20Andorra!5e0!3m2!1sen!2sbr!4v1700000000000!5m2!1sen!2sbr"
                  externalUrl="https://maps.app.goo.gl/6m2s3y4p5q6r7s8t9"
                />
              </div>
            </div>
          </Widget>
        </div>

        {/* Logistics Sidebars */}
        <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-5">
          <Widget title="Grupo & Transfer" icon="fa-solid fa-van-shuttle" accentColor="amber">
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <p className="text-[9px] uppercase font-black text-slate-500 mb-2 tracking-widest">Logística Terrestre</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-black text-lg">Renault Master</span>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-lg border border-amber-500/20">16 PAX</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-5 bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 rounded-2xl shadow-inner">
                <div>
                  <p className="text-[10px] uppercase font-black text-amber-600 mb-1">Cota Individual</p>
                  <p className="text-amber-500 font-black text-3xl tracking-tighter">€ 31,25</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase font-black text-slate-500 mb-1">Total Grupo</p>
                  <p className="text-slate-300 font-bold">€ 375,00</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">Barcelona ➔ Pas de la Casa (3h)</p>
              </div>
            </div>
          </Widget>

          <Widget title="Transporte Local" icon="fa-solid fa-train-subway" accentColor="sky">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all cursor-default">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center mb-3">
                  <i className="fa-solid fa-ticket text-sky-500 text-xs"></i>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">BCN Card</p>
                <p className="text-white font-black text-sm mb-1 uppercase tracking-tighter">T-Usual</p>
                <p className="text-[9px] text-slate-400 font-medium">30 Dias Ilimitado</p>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all cursor-default">
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center mb-3">
                  <i className="fa-solid fa-camera text-sky-500 text-xs"></i>
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Paris Metro</p>
                <p className="text-white font-black text-sm mb-1 uppercase tracking-tighter">Navigo</p>
                <p className="text-[9px] text-slate-400 font-medium">Foto 2x2 Obrigatória</p>
              </div>
            </div>
          </Widget>
        </div>

        {/* Travel Gallery Widget */}
        <div className="md:col-span-12">
          <Widget 
            title="Trip Memories & AI Gallery" 
            icon="fa-solid fa-camera-retro" 
            accentColor="sky"
            footer={<span className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Preserving moments from Andorra & Barcelona</span>}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black uppercase text-slate-300 hover:bg-slate-900 hover:border-slate-700 transition-all"
                  >
                    <i className="fa-solid fa-upload text-sky-500"></i>
                    Upload Photo
                  </button>
                  <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImages(prev => [{ url, caption: file.name, isAI: false }, ...prev]);
                    }
                  }} />
                </div>

                <button 
                  onClick={generateAIMemory}
                  disabled={isGenerating}
                  className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:scale-[1.02] transition-all active:scale-[0.98] ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <i className={`fa-solid ${isGenerating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                  {isGenerating ? 'Generating...' : 'Generate AI Memory'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl transition-all hover:scale-[1.03] hover:border-sky-500/50">
                    <img 
                      src={img.url} 
                      alt={img.caption} 
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{img.caption}</p>
                      {img.isAI && (
                        <span className="mt-1 inline-block text-[8px] font-black text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded-md self-start">AI GENERATED</span>
                      )}
                    </div>
                    {!img.isAI && idx < 3 && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-900/80 backdrop-blur-md rounded-md border border-slate-700">
                        <i className="fa-solid fa-thumbtack text-[8px] text-sky-500"></i>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Empty State / Add Placeholder */}
                <div 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-sky-500/30 hover:bg-sky-500/5 transition-all text-slate-600 hover:text-sky-500"
                >
                  <i className="fa-solid fa-plus text-xl"></i>
                  <span className="text-[9px] font-black uppercase tracking-widest">New Moment</span>
                </div>
              </div>
            </div>
          </Widget>
        </div>

        {/* Financial Row */}
        <div className="md:col-span-12">
          <Widget title="Painel de Controle Financeiro" icon="fa-solid fa-chart-line" accentColor="emerald">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Já Liquidados
                  </h4>
                </div>
                <div className="space-y-3">
                  {PAID_ITEMS.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:bg-slate-950 transition-all">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-200">{item.description}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono">{formatCurrency(item.value, item.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pendentes
                  </h4>
                </div>
                <div className="space-y-3">
                  {PENDING_ITEMS.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-800/50 hover:border-amber-500/30 transition-all">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-200 truncate max-w-[150px]">{item.description}</span>
                      <span className="text-xs font-black text-amber-400 font-mono">{formatCurrency(item.value, item.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <i className="fa-solid fa-piggy-bank text-9xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Daily Food Budget</p>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-white font-black text-6xl tracking-tighter">€ 55</span>
                      <span className="text-slate-500 font-bold text-xl mb-2 italic">/day</span>
                    </div>
                    <p className="text-emerald-500/80 text-xs font-black uppercase tracking-widest">Recommended Goal</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Trip Savings</span>
                      <span className="text-white">ACTIVE</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden">
                      <div className="w-3/4 h-full bg-emerald-500 rounded-full animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Widget>
        </div>

      </div>

      <footer className="mt-20 mb-12 flex flex-col items-center gap-8 no-print">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handlePrint}
            className="group flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-sky-400 transition-all shadow-2xl shadow-white/5 active:scale-95"
          >
            <i className="fa-solid fa-print"></i>
            Print Travel Dossier
          </button>
        </div>
        
        <div className="text-center opacity-40">
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.5em]">
            &copy; 2026 EuroTrip Command Center &bull; Terminal 1.0.4
          </p>
        </div>
      </footer>

      <div className="hidden print-only fixed bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-[9px] font-mono tracking-widest uppercase">
        CONFIDENTIAL TRAVEL DOSSIER &bull; WJR-2026-EU &bull; PAGE 01/01
      </div>
    </div>
  );
};

export default App;
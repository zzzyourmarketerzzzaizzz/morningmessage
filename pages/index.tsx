import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [previousExperiences, setPreviousExperiences] = useState("");
  const [vibe, setVibe] = useState<VibeType>("New-grad");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  let vibeSpecificPrompt = '';

  if (vibe === "New-grad") {
    vibeSpecificPrompt = "Make sure you emphasis that you have graduated from university.";
  } else if (vibe === "Co-op") {
    vibeSpecificPrompt = "Indicate your willingness to learn and grow during your cooperative education.";
  } else if (vibe === "Student") {
    vibeSpecificPrompt = "Stress on your eagerness to gain professional experience while pursuing your studies.";
  } else {
    vibeSpecificPrompt = ""; // Default prompt for other vibes
  }

  const prompt = `Generate a very professional and high-quality cover letter for this candidate's AI intenrship. The applicant's name is ${fullName}, and they graduated from ${university}. They have the following previous experiences: ${previousExperiences}. Use date, name surname etc. fields with placeholders. ${vibeSpecificPrompt}
    Make sure each generated cover letter is around than 600 characters, has profound understanding to the sentences found in Description, and base them on this context: ${bio}${bio.slice(-1) === "." ? "" : "."}`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value).replace(/(?:\r\n|\r|\n)/g, '<br />');
setGeneratedBios((prev) => prev + chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Best AI Cover Letter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
  className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
  href="https://twitter.com/Jeezaicareer"
  target="_blank"
  rel="noopener noreferrer"
>
  <p>Follow on Twitter</p>
</a>

        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Create Your Best Cover Letter For an Internship!
        </h1>
        <p className="text-slate-500 mt-5">1453 students used so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            
            <p className="text-left font-medium">
              Copy and paste the job description{" "}
              <span className="text-slate-500">
                (or add your current cover letter)
              </span>
              .
            </p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Deep Genomics is seeking exceptional graduate or senior undergraduate students for an 8 to 12-month internship with..."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <p className="text-left font-medium">Are you a new-grad, co-op or student? </p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
  {/* New form fields */}
        <div className="flex mt-10 items-center space-x-3">
          <label htmlFor="fullName" className="text-left font-medium">
            Name:
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
          />
        </div>

        <div className="flex mt-10 items-center space-x-3">
          <label htmlFor="university" className="text-left font-medium">
            University/Program:
          </label>
          <input
            id="university"
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
          />
        </div>

        <div className="flex mt-10 items-center space-x-3">
          <label htmlFor="previousExperiences" className="text-left font-medium">
            Previous Experiences:
          </label>
          <input
            id="previousExperiences"
            type="text"
            value={previousExperiences}
            onChange={(e) => setPreviousExperiences(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
          />
        </div>
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Create Now &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                 Best of luck with your cover letter!
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
  .substring(generatedBios.indexOf("1") + 1)
  .split("1.")
  .map((generatedBio) => {
    return (
      <div
        className="bg-white rounded-xl shadow-md p-4 border"
        key={generatedBio}
      >
        <p style={{textAlign: "left"}} dangerouslySetInnerHTML={{ __html: generatedBio }} />
      </div>
    );
  })}


              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

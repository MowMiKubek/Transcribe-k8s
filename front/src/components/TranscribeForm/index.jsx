import { Link, useNavigate } from "react-router";
import { useRef, useState } from "react";

export default function TranscribeForm() {
    const [file, setFile] = useState(null);
    const languageRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if(selectedFile) {
            console.log(selectedFile)
            const validExtensions = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'video/mp4'];
            if(validExtensions.includes(selectedFile.type)) {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Invalid file type. Please upload an audio or video file.");
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!file) {
            setError("Please select a file to transcribe.");
            return;
        }
        setLoading(true);
        setError("");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", languageRef.current.value);
        try {;
            const API_BASE_URL = import.meta.env.MODE == 'development' ? import.meta.env.VITE_TRANSCRIBE_API_URL_BASE : "/transcribe";
            console.log(API_BASE_URL);
            const response = await fetch(`${API_BASE_URL}/transcribe`, {
                method: "POST",
                body: formData
            });
            if(!response.ok) {
                setError("Failed to upload file. Please try again.");
                return;
            } 
            
            const data = await response.json();
            navigate(`/details/${data.job_id}`);
            // console.log(data);
        } catch(err) {
            setError("Failed to upload file. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="w-auto h-10 mx-auto"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=cyan&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
                    Upload file to transcribe
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="file"
                            className="block font-medium text-gray-900 text-sm/6"
                        >
                            File
                        </label>
                        <div className="mt-2">
                            <input
                                type="file"
                                name="file"
                                id="file"
                                onChange={handleFileChange}
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 sm:text-sm/6 ${
                                    error != ""
                                        ? 'outline-red-500'
                                        : 'outline-gray-300 focus:outline-cyan-700'
                                }`}
                            />
                            {error != "" ? (
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                            ) : null}
                        </div>
                    </div>
                    <div>
                    <label
                            htmlFor="language"
                            className="block font-medium text-gray-900 text-sm/6"
                        >
                            Language
                        </label>
                        <div className="mt-2">
                            <select
                                ref={languageRef}
                                name="language"
                                id="language"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 sm:text-sm/6 outline-gray-300 focus:outline-cyan-700"
                            >
                                <option value="en">English</option>
                                <option value="pl">Polish</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="it">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-cyan-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
                            // disabled={loading}
                        >
                            {/* {loading ? 'Signing in...' : 'Sign in'} */}
                            Upload
                        </button>
                        {/* {error && (
                            <p className="mt-2 text-sm text-red-500">Error signing in. Please try again.</p>
                        )} */}
                    </div>
                </form>

                <p className="mt-10 text-center text-gray-500 text-sm/6">
                    <Link to="/" className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Go back
                    </Link>
                </p>
            </div>
        </div>
    );
}

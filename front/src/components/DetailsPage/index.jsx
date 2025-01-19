import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function DetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    
    const API_BASE_URL = import.meta.env.MODE == 'development' ? import.meta.env.VITE_BACKEND_API_URL : "http://express:3000";
    

    useEffect(() => {
        const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || process.env.BACKEND_API_URL;
        console.log(API_BASE_URL);
        if(id) {
            fetch(`${API_BASE_URL}/jobs/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    setData(data);
                    console.log(data)
                })
                .catch((err) => {
                    setError("Failed to fetch job details");
                    console.error(err);
                });
        }
    }, []);

    if(!id) return (
        <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
                    No ID provided
                    <Link to="/" className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Go back
                    </Link>
                </h2>
            </div>
        </div>
    );

    if(error) {
        <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
                    {error}
                    <Link to="/" className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Go back
                    </Link>
                </h2>
            </div>
        </div>
    }

    if(!data) return <p>Loading...</p>

    return (
        <div className="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="w-auto h-10 mx-auto"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=cyan&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">
                    Transcribed file
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <p>File: {data.file_name}</p>
                <p>Status: {data.status}</p>
                {data.status == 'pending' && <p>Check again in a minute</p>}
                {data.status == 'done' && 
                    <table>
                        <thead>
                            <th>#</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Text</th>
                        </thead>
                        <tbody>
                            {data.result.segments.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.start}</td>
                                    <td>{item.end}</td>
                                    <td>{item.text}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            
                }
                <p className="mt-10 text-center text-gray-500 text-sm/6">
                    <Link to="/" className="font-semibold text-cyan-700 hover:text-cyan-600">
                        Go back
                    </Link>
                </p>
            </div>
        </div>
    );

}
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router";

export default function MainPage() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        console.log(import.meta.env);
        const API_BASE_URL = import.meta.env.MODE == 'development' ? import.meta.env.VITE_BACKEND_API_URL : "/api";
        console.log(API_BASE_URL);
        fetch(`${API_BASE_URL}/jobs`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                console.log(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <>
        <table>
            <thead>
                <th>#</th>
                <th>File</th>
                <th>Status</th>
                <th>Details</th>
            </thead>
            <tbody>
                {data && data.map((item, index) => (
                    <tr key={item.job_id}>
                        <td>{index + 1}</td>
                        <td>{item.file_name}</td>
                        <td>{item.status}</td>
                        <td>
                            <Link className="p-1 rounded-md bg-cyan-700" to={`/details/${item.job_id}`}>View</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Link className="text-cyan-700" to="/transcribe">Upload file</Link>
        </>
    )
}
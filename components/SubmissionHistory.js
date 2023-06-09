"use client";
import React, { useState,  useEffect, useCallback} from "react";
import SubmissionCard from "./SubmissionCard";
import SubmissionModal from "./SubmissionModal";
import { Spinner } from "@material-tailwind/react";

export default function SubmissionHistory() {
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 6;
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSubmission, setModalSubmission] = useState(null);

    useEffect(() => {
        setSubmissions([]);
        fetchData();
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/submissions?page=${page}&per_page=${perPage}`);
            if(response.ok) { 
                const data = await response.json();
                if(data.submissions.length === 0) {
                    if(page === 1) setError("No submissions found");
                    else setError("Reached end of submissions");
                    setHasMore(false);
                }
                else {
                    if(data.submissions.length < 6) setHasMore(false);
                    setSubmissions((prevSubmissions) => prevSubmissions.concat(data.submissions));
                }
            }
            else {
                throw new Error("Fetch Failed");
            }
        } catch (error) {
            setError('Sorry, an error occurred. Please try again later.');
        }
        setLoading(false);
    }, [page]);

    const loadMore = useCallback(() => {
        setPage(page + 1);
        fetchData();
    }, [page]);

    const toggleModal = useCallback((submission=null) => {
        setModalOpen((modalOpen) => !modalOpen);
        setModalSubmission(submission);
    }, [modalOpen]);
        
    return (
        <>
            { modalOpen && <SubmissionModal submission={modalSubmission} toggleModal={toggleModal} ></SubmissionModal>}
            <div className="grid grid-cols-l md:grid-cols-2 lg:grid-cols-3 gap-5 h-5/6 overflow-x-hidden overflow-y-scroll">
                {
                    submissions.map((submission) => {
                        return <SubmissionCard key={submission.date} submission={submission} toggleModal={toggleModal}></SubmissionCard>
                    })
                }
            </div>
            <div className="flex w-full justify-center mt-8 text-lg">
                {
                    loading ?
                    <Spinner color="indigo" className="h-12 w-12"/> :
                    <>
                        <button 
                        className={
                            `h-12 w-64 text-pink font-bold border-pink border-2 border-solid rounded-md
                            hover:bg-pink hover:text-white transition-all duration-300 ease-in-out 
                            ${ hasMore ? "block" : "hidden"}`
                        }
                        onClick={loadMore}
                        >
                            Load More
                        </button>
                        <p className={`text-purple ${error ? "block" : "hidden"}`}>{ error }</p>
                    </>
                }
            </div>
        </>
    );
}
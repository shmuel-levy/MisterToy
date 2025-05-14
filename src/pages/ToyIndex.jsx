import { useState, useEffect } from 'react'
import { ToyList } from '../cmps/ToyList.jsx'
import { ToyFilter } from '../cmps/ToyFilter.jsx'
import { toyService } from '../services/toy.service-remote.js' 
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function ToyIndex({ onSelectToy, onAddToy, user }) {
    const [toys, setToys] = useState([])
    const [filterBy, setFilterBy] = useState(toyService.getDefaultFilter())
    const [isLoading, setIsLoading] = useState(false)
    const [pagination, setPagination] = useState({
        pageIdx: 0,
        totalPages: 1
    })
    
    useEffect(() => {
        loadToys()
    }, [filterBy, pagination.pageIdx])
    
    async function loadToys() {
        setIsLoading(true)
        
        const queryParams = {
            ...filterBy,
            pageIdx: pagination.pageIdx
        }
        
        try {
            const response = await toyService.query(queryParams)
            setToys(response.toys || [])
            setPagination(prev => ({ 
                ...prev, 
                totalPages: response.totalPages || 1 
            }))
        } catch (err) {
            console.error('Error loading toys:', err)
            showErrorMsg('Failed to load toys')
            setToys([])
        } finally {
            setIsLoading(false)
        }
    }
    
    function onSetFilter(newFilterBy) {
        setPagination(prev => ({ ...prev, pageIdx: 0 }))
        setFilterBy(newFilterBy)
    }
    
    async function onRemoveToy(toyId) {

        if (!user) {
            showErrorMsg('Please login to remove toys')
            return
        }
        
        if (!user.isAdmin) {
            showErrorMsg('Only admins can remove toys')
            return
        }
        
        try {
            await toyService.remove(toyId)
            setToys(prevToys => prevToys.filter(toy => toy._id !== toyId))
            showSuccessMsg('Toy removed successfully!')
    
            if (toys.length === 1 && pagination.pageIdx > 0) {
                setPagination(prev => ({ ...prev, pageIdx: prev.pageIdx - 1 }))
            } else {
                loadToys()
            }
        } catch (err) {
            console.error('Error removing toy:', err)
            showErrorMsg('Failed to remove toy')
        }
    }
    
    function handlePageChange(newPageIdx) {
        if (newPageIdx >= 0 && newPageIdx < pagination.totalPages) {
            setPagination(prev => ({ ...prev, pageIdx: newPageIdx }))
        }
    }
    
    function handleAddToy() {
  
        if (!user) {
            showErrorMsg('Please login to add toys')
            return
        }
        
        if (!user.isAdmin) {
            showErrorMsg('Only admins can add toys')
            return
        }
        
        onAddToy()
    }
    
    return (
        <section className="toy-index">
            <div className="index-header">
                <h1>Our Toy Collection</h1>
            
                <button 
                    className={`btn-add ${(!user || !user.isAdmin) ? 'disabled' : ''}`}
                    onClick={handleAddToy}
                    disabled={!user || !user.isAdmin}
                >
                    Add New Toy
                </button>
            </div>
            
            <ToyFilter onSetFilter={onSetFilter} />
            
            {isLoading && <div className="loading">Loading...</div>}
            
            {!isLoading && toys.length === 0 ? (
                <div className="no-toys">
                    No toys found. Try changing your filters.
                </div>
            ) : (
                <>
                    <ToyList 
                        toys={toys} 
                        onRemoveToy={onRemoveToy} 
                        onSelectToy={onSelectToy}
                        user={user} 
                    />
                    
                    {toys.length > 0 && (
                        <div className="pagination">
                            <button 
                                className="page-btn prev"
                                onClick={() => handlePageChange(pagination.pageIdx - 1)}
                                disabled={pagination.pageIdx === 0 || isLoading}
                            >
                                &laquo; Previous
                            </button>
                            
                            <span className="page-info">
                                Page {pagination.pageIdx + 1} of {pagination.totalPages}
                            </span>
                            
                            <button 
                                className="page-btn next"
                                onClick={() => handlePageChange(pagination.pageIdx + 1)}
                                disabled={pagination.pageIdx >= pagination.totalPages - 1 || isLoading}
                            >
                                Next &raquo;
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
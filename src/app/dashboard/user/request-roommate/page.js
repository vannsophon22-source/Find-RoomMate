'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import { listings } from '@/data/listings'
import { useSearchParams } from 'next/navigation'
import { 
  User, 
  Home, 
  DollarSign, 
  MapPin, 
  Calendar,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  Image as ImageIcon,
  Bed,
  Bath,
  Users,
  Wifi,
  Car,
  Coffee,
  Dog,
  Search,
  MessageSquare,
  Globe,
  Music,
  Moon,
  Clock,
  Heart,
  ThumbsUp,
  Trash2,
  Plus,
  Check,
  X,
  Edit,
  Eye,
  Share2
} from 'lucide-react'

// Custom Thermometer icon component
const Thermometer = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
)

// Helper function to save to localStorage
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Helper function to load from localStorage
const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return defaultValue
  }
}

// Helper function to calculate description similarity
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 2
  ).length;
  
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  
  return totalUniqueWords > 0 ? (commonWords / totalUniqueWords) * 100 : 0;
}

export default function RequestRoommatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')) : 1
  const initialPostId = searchParams.get('postId') // For viewing specific post
  const [step, setStep] = useState(initialStep)
  const [loading, setLoading] = useState(false)
  const [currentPostId, setCurrentPostId] = useState(initialPostId || null)
  const [matchScore, setMatchScore] = useState(0)

  // Load saved data from localStorage on initial render
  const [roommateRequestForm, setRoommateRequestForm] = useState(() => 
    loadFromLocalStorage('roommateRequestForm', {
      title: '',
      image: '',
      location: '',
      numberOfMembers: 1,
      gender: '',
      pricePerPerson: '',
      description: '',
      amenities: [],
      lifestylePreferences: ''
    })
  )

  const [beRoommateForm, setBeRoommateForm] = useState(() =>
    loadFromLocalStorage('beRoommateForm', {
      location: '',
      budget: '',
      lifestyleDescription: '',
      preferences: ''
    })
  )

  const [roommateRequests, setRoommateRequests] = useState(() =>
    loadFromLocalStorage('roommateRequests', [])
  )

  const [roommateSeekers, setRoommateSeekers] = useState(() =>
    loadFromLocalStorage('roommateSeekers', [])
  )

  const amenitiesOptions = [
    { icon: <Wifi size={18} />, label: 'WiFi' },
    { icon: <Car size={18} />, label: 'Parking' },
    { icon: <Coffee size={18} />, label: 'Kitchen' },
    { icon: <Dog size={18} />, label: 'Pet Friendly' },
    { icon: <Users size={18} />, label: 'Shared Space' },
    { icon: <Bed size={18} />, label: 'Furnished' }
  ]

  const genderOptions = ['Male', 'Female', 'Any', 'Non-binary']

  const locationOptions = [
    'Chamkarmon',
    'Toul Kork',
    '7 Makara',
    'Daun Penh',
    'Russey Keo',
    'Sen Sok',
    'Boeung Keng Kang',
    'Chroy Changvar'
  ]

  // Lifestyle tags for quick selection
  const lifestyleTags = [
    'Quiet', 'Social', 'Clean', 'Studious', 'Night Owl', 'Early Bird',
    'Vegetarian', 'Pet Lover', 'Fitness Enthusiast', 'Gamer', 'Music Lover',
    'Minimalist', 'Home Cook', 'Outdoorsy', 'Tech Savvy', 'Artistic'
  ]

  // Get current post for viewing/editing
  const currentPost = roommateRequests.find(post => post.id === parseInt(currentPostId))

  // Save forms to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('roommateRequestForm', roommateRequestForm)
  }, [roommateRequestForm])

  useEffect(() => {
    saveToLocalStorage('beRoommateForm', beRoommateForm)
  }, [beRoommateForm])

  useEffect(() => {
    saveToLocalStorage('roommateRequests', roommateRequests)
  }, [roommateRequests])

  useEffect(() => {
    saveToLocalStorage('roommateSeekers', roommateSeekers)
  }, [roommateSeekers])

  // Pre-fill location & budget if coming from a room
  useEffect(() => {
    if (initialStep === 5) {
      const location = searchParams.get('location') || ''
      const budget = searchParams.get('budget') || ''
      if (location || budget) {
        setBeRoommateForm(prev => ({
          ...prev,
          location,
          budget
        }))
      }
    }
  }, [searchParams, initialStep])

  // If viewing a post, set step to 6 (Post Details)
  useEffect(() => {
    if (currentPostId && currentPost) {
      setStep(6)
    }
  }, [currentPostId, currentPost])

  const handleRoommateRequestChange = (e) => {
    setRoommateRequestForm({ ...roommateRequestForm, [e.target.name]: e.target.value })
  }

  const handleBeRoommateChange = (e) => {
    setBeRoommateForm({ ...beRoommateForm, [e.target.name]: e.target.value })
  }

  const toggleAmenity = (amenity) => {
    setRoommateRequestForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const toggleLifestyleTag = (tag) => {
    const tags = roommateRequestForm.lifestylePreferences?.split(',') || []
    const updatedTags = tags.includes(tag)
      ? tags.filter(t => t !== tag).join(',')
      : [...tags, tag].join(',')
    
    setRoommateRequestForm(prev => ({
      ...prev,
      lifestylePreferences: updatedTags
    }))
  }

  // Submit form for users who HAVE a room and want to find roommates
  const handleFindRoommatesSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const postId = Date.now()
      const formData = { 
        ...roommateRequestForm, 
        id: postId,
        createdAt: new Date().toISOString(),
        type: 'roommate_request',
        status: 'active',
        views: 0,
        inquiries: 0
      }
      
      // Save to localStorage
      const newRequests = [...roommateRequests, formData]
      setRoommateRequests(newRequests)
      
      // Set the current post ID
      setCurrentPostId(postId)
      
      // Go to post details page
      setStep(6)
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update existing post
  const handleUpdatePost = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedPost = { 
        ...roommateRequestForm, 
        id: currentPost.id,
        createdAt: currentPost.createdAt,
        updatedAt: new Date().toISOString(),
        type: 'roommate_request',
        status: 'active',
        views: currentPost.views || 0,
        inquiries: currentPost.inquiries || 0
      }
      
      // Update in localStorage
      const updatedRequests = roommateRequests.map(post => 
        post.id === currentPost.id ? updatedPost : post
      )
      setRoommateRequests(updatedRequests)
      
      // Show success message
      alert('Your post has been updated successfully!')
      setStep(6)
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete post
  const handleDeletePost = () => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      const updatedRequests = roommateRequests.filter(post => post.id !== currentPost.id)
      setRoommateRequests(updatedRequests)
      alert('Your post has been deleted successfully!')
      setStep(1)
      setCurrentPostId(null)
    }
  }

  // Submit form for users who want to BE roommates
  const handleBeRoommateSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = { 
        ...beRoommateForm, 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        type: 'roommate_seeker',
        status: 'active'
      }
      
      // Save to localStorage
      const newSeekers = [...roommateSeekers, formData]
      setRoommateSeekers(newSeekers)
      
      // Reset form
      setBeRoommateForm({
        location: '',
        budget: '',
        lifestyleDescription: '',
        preferences: ''
      })
      
      // Show matching posts
      setStep(4)
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load post data into form for editing
  const handleEditPost = () => {
    if (currentPost) {
      setRoommateRequestForm({
        title: currentPost.title || '',
        image: currentPost.image || '',
        location: currentPost.location || '',
        numberOfMembers: currentPost.numberOfMembers || 1,
        gender: currentPost.gender || '',
        pricePerPerson: currentPost.pricePerPerson || '',
        description: currentPost.description || '',
        amenities: currentPost.amenities || [],
        lifestylePreferences: currentPost.lifestylePreferences || ''
      })
      setStep(7) // Go to edit form
    }
  }

  // Calculate match score between a room post and seeker
  const calculateMatchScore = (roomPost) => {
    let score = 0;
    let totalCriteria = 0;

    // Location match (30 points)
    if (beRoommateForm.location && roomPost.location) {
      if (beRoommateForm.location === roomPost.location) {
        score += 30;
      }
    }
    totalCriteria += 30;

    // Budget match (30 points)
    if (beRoommateForm.budget && roomPost.pricePerPerson) {
      const seekerBudget = parseInt(beRoommateForm.budget);
      const roomPrice = parseInt(roomPost.pricePerPerson);
      if (seekerBudget >= roomPrice) {
        score += 30;
      } else if (seekerBudget >= roomPrice * 0.8) {
        score += 15; // Partial match
      }
    }
    totalCriteria += 30;

    // Lifestyle description match (40 points)
    if (beRoommateForm.lifestyleDescription && roomPost.description) {
      const similarity = calculateSimilarity(
        beRoommateForm.lifestyleDescription,
        roomPost.description
      );
      score += (similarity / 100) * 40; // Convert percentage to points
    }
    totalCriteria += 40;

    // Normalize to 100
    return Math.min(Math.round((score / totalCriteria) * 100), 100);
  };

  // Progress steps
  const getProgressSteps = () => {
    const steps = [
      { number: 1, title: 'Start', active: step === 1 },
      { number: 2, title: 'Details', active: step === 2 || step === 5 || step === 7 },
      { number: 3, title: 'Complete', active: step === 3 || step === 4 || step === 6 }
    ]
    return steps
  }

  // Get recommended listings with match scores
  const getRecommendedListings = () => {
    // First, try to match with actual roommate requests
    const matchingRequests = roommateRequests
      .map(request => {
        const matchScore = calculateMatchScore(request);
        return {
          ...request,
          matchScore,
          type: 'roommate_request',
          isMock: false
        };
      })
      .filter(request => request.matchScore >= 50) // Only show matches above 50%
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by highest match

    // If no matching requests, show some mock listings
    if (matchingRequests.length === 0) {
      return listings.slice(0, 6).map(listing => ({
        ...listing,
        matchScore: 75, // Default score for mock listings
        type: 'roommate_request',
        isMock: true
      }));
    }

    return matchingRequests;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Users size={20} className="text-white" />
            <span className="text-white text-sm font-medium">Find Your Perfect Match</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Ideal
            <span className="block text-yellow-300">Roommate</span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Connect with compatible roommates based on lifestyle and preferences
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {getProgressSteps().map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    stepItem.active 
                      ? 'bg-white border-white text-blue-600' 
                      : 'border-white/30 text-white/30'
                  } font-semibold`}>
                    {stepItem.active ? <CheckCircle size={20} /> : stepItem.number}
                  </div>
                  {index < getProgressSteps().length - 1 && (
                    <div className={`w-24 h-1 ${
                      stepItem.active ? 'bg-white' : 'bg-white/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-white/80 text-sm">
              {getProgressSteps().map(stepItem => (
                <span key={stepItem.number}>{stepItem.title}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 -mt-8 relative z-10">
        {/* Step 1: Ask if user has a room */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-8 border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
              <Home className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-blue-700 dark:text-blue-300 font-medium">Let's Get Started</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Do you have a room available?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
              Tell us about your situation so we can help you find the perfect match
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <button
                onClick={() => setStep(2)}
                className="group flex-1 max-w-sm mx-auto sm:mx-0 px-8 py-5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl border border-emerald-400/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <Home size={24} />
                  <div className="text-left">
                    <div className="font-bold text-xl">Yes, I Have a Room</div>
                    <div className="text-sm opacity-90">Find roommates to share with</div>
                  </div>
                  <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={() => setStep(3)}
                className="group flex-1 max-w-sm mx-auto sm:mx-0 px-8 py-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl border border-rose-400/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <User size={24} />
                  <div className="text-left">
                    <div className="font-bold text-xl">No, I Don't Have a Room</div>
                    <div className="text-sm opacity-90">I need to find a place</div>
                  </div>
                  <ArrowRight className="ml-auto group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: User HAS a room → Form to find roommates (Create New) */}
        {step === 2 && (
          <form onSubmit={handleFindRoommatesSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 space-y-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-3">
                  <Users size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Find Roommates</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post Your Room</h2>
                <p className="text-gray-600 dark:text-gray-400">Fill in details to find compatible roommates</p>
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Step 2/3</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <Home size={18} className="text-gray-400" />
                  Listing Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={roommateRequestForm.title} 
                  onChange={handleRoommateRequestChange} 
                  placeholder="e.g., Spacious 3BR Apartment in City Center" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <ImageIcon size={18} className="text-gray-400" />
                  Room Image URL
                </label>
                <input 
                  type="url" 
                  name="image" 
                  value={roommateRequestForm.image} 
                  onChange={handleRoommateRequestChange} 
                  placeholder="https://example.com/room-image.jpg" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <MapPin size={18} className="text-gray-400" />
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={roommateRequestForm.location}
                  onChange={handleRoommateRequestChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Location</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Number of Members Needed */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <Users size={18} className="text-gray-400" />
                  Roommates Needed <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setRoommateRequestForm(prev => ({
                      ...prev,
                      numberOfMembers: Math.max(1, prev.numberOfMembers - 1)
                    }))}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold">{roommateRequestForm.numberOfMembers}</span>
                  <button
                    type="button"
                    onClick={() => setRoommateRequestForm(prev => ({
                      ...prev,
                      numberOfMembers: prev.numberOfMembers + 1
                    }))}
                    className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Preferred Gender */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <User size={18} className="text-gray-400" />
                  Preferred Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRoommateRequestForm(prev => ({ ...prev, gender: option }))}
                      className={`py-3 rounded-xl border-2 text-center font-medium transition-all ${
                        roommateRequestForm.gender === option
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:border-emerald-300 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Per Person */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <DollarSign size={18} className="text-gray-400" />
                  Price Per Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="number" 
                    name="pricePerPerson" 
                    value={roommateRequestForm.pricePerPerson} 
                    onChange={handleRoommateRequestChange} 
                    placeholder="Monthly cost per roommate" 
                    required 
                    min="0"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                Room & Lifestyle Description <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Describe the room, house rules, neighborhood, and what kind of roommates you're looking for
              </p>
              <textarea 
                name="description" 
                value={roommateRequestForm.description} 
                onChange={handleRoommateRequestChange} 
                placeholder="Example: Looking for quiet, clean roommates who enjoy cooking. The apartment has a shared kitchen and living room. We value respect and communication..." 
                required 
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Lifestyle Tags */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                <Heart size={18} className="text-gray-400" />
                Lifestyle Preferences
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select tags that describe your ideal roommate's lifestyle
              </p>
              <div className="flex flex-wrap gap-2">
                {lifestyleTags.map(tag => {
                  const isSelected = roommateRequestForm.lifestylePreferences?.split(',').includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleLifestyleTag(tag)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 mb-3">
                <Globe size={18} className="text-gray-400" />
                Amenities Available
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {amenitiesOptions.map((amenity) => (
                  <button
                    key={amenity.label}
                    type="button"
                    onClick={() => toggleAmenity(amenity.label)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      roommateRequestForm.amenities.includes(amenity.label)
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    {amenity.icon}
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    Post & Find Roommates
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 6: Post Details Page (After Posting) */}
        {step === 6 && currentPost && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Post Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full mb-3">
                    <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Posted Successfully!</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Your Roommate Request</h2>
                  <p className="text-gray-600 dark:text-gray-400">Your post is now live and visible to potential roommates</p>
                </div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Step 3/3</div>
              </div>
              
              {/* Post Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentPost.views || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentPost.inquiries || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Inquiries</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentPost.numberOfMembers || 1}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Roommates Needed</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">${currentPost.pricePerPerson || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Price Per Person</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleEditPost}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Edit size={18} />
                  Edit Post
                </button>
                <button
                  onClick={() => router.push('/dashboard/user/homepage')}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <Eye size={18} />
                  View in Dashboard
                </button>
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/request-roommate?postId=${currentPost.id}`
                    navigator.clipboard.writeText(shareUrl)
                    alert('Share link copied to clipboard!')
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                >
                  <Share2 size={18} />
                  Share
                </button>
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                >
                  <Trash2 size={18} />
                  Delete Post
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-8">
              {/* Post Image */}
              {currentPost.image && (
                <div className="mb-8">
                  <img 
                    src={currentPost.image} 
                    alt={currentPost.title}
                    className="w-full h-64 md:h-96 object-cover rounded-2xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Main Details */}
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room Details</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</h4>
                        <p className="text-gray-900 dark:text-white text-lg">{currentPost.title}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{currentPost.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Preferences */}
                  {currentPost.lifestylePreferences && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Lifestyle Preferences</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
                        <div className="flex flex-wrap gap-2">
                          {currentPost.lifestylePreferences.split(',').map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <MapPin size={20} className="text-emerald-600 dark:text-emerald-400" />
                      Location
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{currentPost.location}</p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users size={20} className="text-blue-600 dark:text-blue-400" />
                      Roommate Preferences
                    </h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Gender Preference:</span> {currentPost.gender || 'Any'}</p>
                      <p><span className="font-medium">Roommates Needed:</span> {currentPost.numberOfMembers}</p>
                      <p><span className="font-medium">Price Per Person:</span> ${currentPost.pricePerPerson}/month</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {currentPost.amenities && currentPost.amenities.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Globe size={20} className="text-purple-600 dark:text-purple-400" />
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentPost.amenities.map((amenity, index) => {
                          const amenityObj = amenitiesOptions.find(a => a.label === amenity)
                          return (
                            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg">
                              {amenityObj?.icon}
                              <span className="text-sm font-medium">{amenity}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Post Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Posted:</span> {new Date(currentPost.createdAt).toLocaleDateString()}</p>
                      {currentPost.updatedAt && (
                        <p><span className="font-medium">Last Updated:</span> {new Date(currentPost.updatedAt).toLocaleDateString()}</p>
                      )}
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          currentPost.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {currentPost.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: User does NOT have room → Ask if they want a room */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center space-y-8 border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
              <User className="text-purple-600 dark:text-purple-400" size={20} />
              <span className="text-purple-700 dark:text-purple-300 font-medium">What are you looking for?</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Do you want to find a room?
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
              Choose how you'd like to proceed with finding your ideal living situation
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <button
                onClick={() => router.push('/dashboard/user/rooms')}
                className="group p-8 text-left bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Search className="text-blue-600 dark:text-blue-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Browse Available Rooms</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Check out rooms that are already available and contact the hosts directly
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                      Browse Rooms
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setStep(5)}
                className="group p-8 text-left bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Users className="text-purple-600 dark:text-purple-400" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Be a Roommate</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Let us find roommates for you based on lifestyle compatibility
                    </p>
                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                      Find Roommates
                      <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Show recommended listings with match scores */}
        {step === 4 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Recommended Rooms for You
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Based on your preferences: {beRoommateForm.location} • Budget: ${beRoommateForm.budget}
                </p>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Step 3/3</div>
            </div>
            
            {getRecommendedListings().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getRecommendedListings().map((room) => (
                  <div key={room.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={room.image} 
                        alt={room.title}
                        className="w-full h-full object-cover"
                      />
                      {!room.isMock && (
                        <div className="absolute top-3 right-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            room.matchScore >= 80 
                              ? 'bg-green-500 text-white'
                              : room.matchScore >= 60
                              ? 'bg-yellow-500 text-white'
                              : 'bg-orange-500 text-white'
                          }`}>
                            {room.matchScore}% Match
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{room.title}</h3>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          ${room.pricePerPerson || room.price}<span className="text-sm text-gray-500">/month</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-3">
                        <MapPin size={16} />
                        <span>{room.location}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {room.description}
                      </p>
                      {room.lifestylePreferences && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {room.lifestylePreferences.split(',').slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {room.roommatesNeeded && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Users size={16} />
                            <span>Looking for {room.roommatesNeeded} roommate{room.roommatesNeeded > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          if (room.type === 'roommate_request') {
                            setCurrentPostId(room.id)
                            setStep(6)
                          } else {
                            router.push(`/rooms/${room.id}`)
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                      >
                        {room.type === 'roommate_request' ? 'View Roommate Request' : 'View Room Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Search className="text-purple-600 dark:text-purple-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No matches found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We couldn't find rooms matching your criteria. Try adjusting your preferences.
                </p>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Adjust Preferences
                </button>
              </div>
            )}
            
            <div className="text-center mt-10">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                Back to Options
              </button>
            </div>
          </section>
        )}

        {/* Step 5: User wants to BE a roommate form */}
        {step === 5 && (
          <form onSubmit={handleBeRoommateSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 space-y-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full mb-3">
                  <Users size={16} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">Be a Roommate</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Preferences</h2>
                <p className="text-gray-600 dark:text-gray-400">Tell us what you're looking for in a roommate</p>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Step 2/3</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <MapPin size={18} className="text-gray-400" />
                  Preferred Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={beRoommateForm.location}
                  onChange={handleBeRoommateChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Location</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                  <DollarSign size={18} className="text-gray-400" />
                  Maximum Budget ($/month) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="budget"
                    value={beRoommateForm.budget}
                    onChange={handleBeRoommateChange}
                    placeholder="Your maximum monthly budget"
                    required
                    min="0"
                    step="50"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
                Your Lifestyle & Preferences <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Describe your lifestyle, habits, daily routine, and what you're looking for in roommates
              </p>
              <textarea
                name="lifestyleDescription"
                value={beRoommateForm.lifestyleDescription}
                onChange={handleBeRoommateChange}
                rows={4}
                placeholder="Example: I'm a quiet student who enjoys cooking. I prefer clean spaces and value open communication. Looking for roommates who respect personal space and share similar values..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Finding Matches...
                  </>
                ) : (
                  <>
                    Find Compatible Roommates
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      <Footer />
    </div>
  )
}
'use client'

import { useState } from 'react'

export default function TwitterPoster() {
  const [prompt, setPrompt] = useState('')
  const [generatedTweet, setGeneratedTweet] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [isBulkPosting, setIsBulkPosting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [bulkResults, setBulkResults] = useState<any>(null)
  
  // Twitter credentials override
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    accessToken: '',
    accessSecret: ''
  })

  const generateTweet = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or idea')
      return
    }

    setIsGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tweet')
      }

      setGeneratedTweet(data.content)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tweet')
    } finally {
      setIsGenerating(false)
    }
  }

  const postToTwitter = async () => {
    if (!generatedTweet.trim()) {
      setError('No tweet to post')
      return
    }

    setIsPosting(true)
    setError('')
    setSuccess('')

    try {
      const requestBody: any = { content: generatedTweet }
      
      // If credentials are provided in UI, override env variables
      if (credentials.apiKey && credentials.apiSecret && credentials.accessToken && credentials.accessSecret) {
        requestBody.credentials = credentials
      }

      const response = await fetch('/api/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post tweet')
      }

      setSuccess('Tweet posted successfully! 🎉')
      setGeneratedTweet('')
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post tweet')
    } finally {
      setIsPosting(false)
    }
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/csv') {
      setCsvFile(file)
      setError('')
    } else {
      setError('Please select a valid CSV file')
    }
  }

  const postFromCSV = async () => {
    if (!csvFile) {
      setError('Please select a CSV file first')
      return
    }

    setIsBulkPosting(true)
    setError('')
    setSuccess('')
    setBulkResults(null)

    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      
      // If credentials are provided in UI, add them to form data
      if (credentials.apiKey && credentials.apiSecret && credentials.accessToken && credentials.accessSecret) {
        formData.append('credentials', JSON.stringify(credentials))
      }

      const response = await fetch('/api/twitter/csv', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post tweets from CSV')
      }

      setBulkResults(data)
      setSuccess(`Bulk posting completed! ${data.summary.successful}/${data.summary.total} tweets posted successfully.`)
      setCsvFile(null)
      // Reset file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post tweets from CSV')
    } finally {
      setIsBulkPosting(false)
    }
  }

  const characterCount = generatedTweet.length
  const isOverLimit = characterCount > 280

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Twitter Poster with AI
        </h1>
        
        {/* Twitter Credentials Override Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-yellow-800">
              🔑 Twitter API Credentials (Dev Testing)
            </h2>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-yellow-700 hover:text-yellow-900 font-medium"
            >
              {showCredentials ? 'Hide' : 'Show'} Credentials
            </button>
          </div>
          
          {showCredentials && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  API Key
                </label>
                <input
                  type="text"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                  placeholder="your_api_key_here"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={credentials.apiSecret}
                  onChange={(e) => setCredentials({...credentials, apiSecret: e.target.value})}
                  placeholder="your_api_secret_here"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Access Token
                </label>
                <input
                  type="text"
                  value={credentials.accessToken}
                  onChange={(e) => setCredentials({...credentials, accessToken: e.target.value})}
                  placeholder="your_access_token_here"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-1">
                  Access Token Secret
                </label>
                <input
                  type="password"
                  value={credentials.accessSecret}
                  onChange={(e) => setCredentials({...credentials, accessSecret: e.target.value})}
                  placeholder="your_access_secret_here"
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          )}
          
          <p className="text-sm text-yellow-700 mt-3">
            💡 <strong>Dev Mode:</strong> Enter credentials here to override .env.local for testing. 
            {credentials.apiKey && credentials.apiSecret && credentials.accessToken && credentials.accessSecret 
              ? " ✅ All credentials provided - will override env variables" 
              : " Using .env.local credentials if available"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Single Tweet Section */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Generate & Post Single Tweet</h2>
            
            {/* Input Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What should the tweet be about?
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., shipping fast as a developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateTweet}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating Tweet...' : 'Generate Tweet'}
            </button>

            {/* Generated Tweet Section */}
            {generatedTweet && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Tweet (editable)
                  <span className={`ml-2 text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                    {characterCount}/280
                  </span>
                </label>
                <textarea
                  value={generatedTweet}
                  onChange={(e) => setGeneratedTweet(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isOverLimit ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isPosting}
                />
                {isOverLimit && (
                  <p className="text-red-600 text-sm mt-1">
                    Tweet is over 280 characters. Please shorten it.
                  </p>
                )}
              </div>
            )}

            {/* Post to Twitter Button */}
            {generatedTweet && (
              <button
                onClick={postToTwitter}
                disabled={isPosting || isOverLimit || !generatedTweet.trim()}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isPosting ? 'Posting to Twitter...' : 'Post to Twitter'}
              </button>
            )}
          </div>

          {/* Bulk CSV Section */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Bulk Post from CSV</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <p className="text-xs text-gray-500 mb-2">
                CSV should have columns: tweet, url (optional), hashtags (optional)
              </p>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isBulkPosting}
              />
            </div>

            {csvFile && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Selected:</strong> {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}

            <button
              onClick={postFromCSV}
              disabled={isBulkPosting || !csvFile}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isBulkPosting ? 'Posting Tweets...' : 'Post All Tweets from CSV'}
            </button>

            {bulkResults && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">Bulk Posting Results:</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-1 font-semibold">{bulkResults.summary.total}</span>
                  </div>
                  <div>
                    <span className="text-green-600">Success:</span>
                    <span className="ml-1 font-semibold text-green-700">{bulkResults.summary.successful}</span>
                  </div>
                  <div>
                    <span className="text-red-600">Failed:</span>
                    <span className="ml-1 font-semibold text-red-700">{bulkResults.summary.failed}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Make sure Ollama is running locally with llama3 model</p>
          <p>Configure your Twitter API credentials in .env.local</p>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'

function MetaData(props) {
  const [customTitleChecked, setCustomTitleChecked] = useState(false)
  const [customTitle, setCustomTitle] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [customTimeOffset, setCustomTimeOffset] = useState('')
  const [customTimeChecked, setCustomTimeChecked] = useState(false)
  const [customTimeOffsetChecked, setCustomTimeOffsetChecked] = useState(false)
  const [customReleaseDate, setCustomReleaseDate] = useState('')
  const [customReleaseDateChecked, setCustomReleaseDateChecked] = useState(false)
  const [customRating, setCustomRating] = useState('')
  const [customRatingChecked, setCustomRatingChecked] = useState(false)

  const loadPreferences = async () => {
    try {
      const response = await fetch(`http://localhost:8080/LoadPreferences?uid=${props.uid}`)
      const json = await response.json()
      console.log(json)
      setCustomTitle(json.preferences.title.value)
      setCustomTime(json.preferences.time.value)
      setCustomTimeOffset(json.preferences.timeOffset.value)
      setCustomRating(json.preferences.rating.value)

      if (json.preferences.title.checked == '1') {
        setCustomTitleChecked(true)
      }
      if (json.preferences.time.checked == '1') {
        setCustomTimeChecked(true)
      }
      if (json.preferences.timeOffset.checked == '1') {
        setCustomTimeOffsetChecked(true)
      }
      if (json.preferences.releaseDate.checked == '1') {
        setCustomReleaseDateChecked(true)
        setCustomReleaseDate(json.preferences.releaseDate.value)
      }
      if (json.preferences.rating.checked == '1') {
        setCustomRatingChecked(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadPreferences()
  }, [])

  const saveClickHandler = () => {
    const customTitleElement = document.getElementById('customTitle')
    const customRatingElement = document.getElementById('rating')
    const customReleaseDateElement = document.getElementById('releaseDate')
    const timeElement = document.getElementById('customTime')
    const timeOffsetElement = document.getElementById('customTimeOffset')
    let title = ''
    let rating = '0'
    let releaseDate = ''
    let time = '0'
    let timeOffset = '0'
    const uid = props.uid

    if (customTitleElement && customTitleElement.value.trim() !== '') {
      title = customTitleElement.value
    }

    if (customRatingElement && customRatingElement.value.trim() !== '') {
      rating = customRatingElement.value
    }

    if (customReleaseDateElement && customReleaseDateElement.value.trim() !== '') {
      releaseDate = customReleaseDateElement.value
    }

    if (timeElement && timeElement.value.trim() !== '') {
      time = timeElement.value.toString()
    }
    if (timeOffsetElement && timeOffsetElement.value.trim() !== '') {
      timeOffset = timeOffsetElement.value.toString()
    }

    console.log(title, time, timeOffset, releaseDate, rating)

    const postData = {
      customTitleChecked: customTitleChecked,
      customTitle: title,
      customTimeChecked: customTimeChecked,
      customTime: time,
      customTimeOffsetChecked: customTimeOffsetChecked,
      customTimeOffset: timeOffset,
      customRatingChecked: customRatingChecked,
      customRating: rating,
      customReleaseDateChecked: customReleaseDateChecked,
      customReleaseDate: releaseDate,
      UID: uid
    }
    savePreferences(postData)
  }

  const savePreferences = async (postData) => {
    try {
      const response = await fetch(`http://localhost:8080/SavePreferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      const json = await response.json()
      if (json.status === 'OK') {
        props.re_renderTrigger()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCheckboxChange = (event, title) => {
    const checked = event.target.checked
    switch (title) {
      case 'title':
        setCustomTitleChecked(checked)
        break

      case 'time':
        if (checked == false) {
          setCustomTimeChecked(false)
        } else {
          setCustomTimeChecked(true)
          setCustomTimeOffsetChecked(false)
        }
        break

      case 'timeOffset':
        if (checked == false) {
          setCustomTimeOffsetChecked(false)
        } else {
          setCustomTimeOffsetChecked(true)
          setCustomTimeChecked(false)
        }
        break

      case 'releaseDate':
        setCustomReleaseDateChecked(checked)
        break

      case 'rating':
        setCustomRatingChecked(checked)
        break

      default:
        break
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 mt-4 w-full h-full text-base rounded-xl">
      <div className="flex flex-row gap-6 w-full h-full">
        <div className="flex flex-col gap-4 w-1/2">
          <div className="flex flex-row gap-4 items-center">
            <p>Use Custom Title?</p>
            <input
              type="checkbox"
              checked={customTitleChecked}
              onChange={(event) => handleCheckboxChange(event, 'title')}
              className="px-2 rounded-lg bg-gray-500/20"
            />

            <input
              disabled={!customTitleChecked}
              type="text"
              id="customTitle"
              className="px-2 w-52 h-6 rounded-lg bg-gray-500/20"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            <p>Set Custom Time Played?</p>
            <input
              type="checkbox"
              checked={customTimeChecked}
              onChange={(event) => handleCheckboxChange(event, 'time')}
              className="px-2 rounded-lg bg-gray-500/20"
            />
            <input
              disabled={!customTimeChecked}
              type="number"
              id="customTime"
              className="px-2 w-52 h-6 rounded-lg bg-gray-500/20"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            <p>Set Custom Time Offset?</p>
            <input
              type="checkbox"
              checked={customTimeOffsetChecked}
              onChange={(event) => handleCheckboxChange(event, 'timeOffset')}
              className="px-2 rounded-lg bg-gray-500/20"
            />
            <input
              disabled={!customTimeOffsetChecked}
              type="number"
              id="customTimeOffset"
              className="px-2 w-52 h-6 rounded-lg bg-gray-500/20"
              value={customTimeOffset}
              onChange={(e) => setCustomTimeOffset(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            <p>Set Custom Release Date?</p>
            <input
              type="checkbox"
              checked={customReleaseDateChecked}
              onChange={(event) => handleCheckboxChange(event, 'releaseDate')}
              className="px-2 rounded-lg bg-gray-500/20"
            />
            <input
              disabled={!customReleaseDateChecked}
              type="date"
              id="releaseDate"
              className="px-2 w-52 h-6 rounded-lg bg-gray-500/20"
              value={customReleaseDate}
              onChange={(e) => setCustomReleaseDate(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-4 items-center">
            <p>Set Custom Rating?</p>
            <input
              type="checkbox"
              checked={customRatingChecked}
              onChange={(event) => handleCheckboxChange(event, 'rating')}
              className="px-2 rounded-lg bg-gray-500/20"
            />
            <input
              disabled={!customRatingChecked}
              type="number"
              id="rating"
              className="px-2 w-52 h-6 rounded-lg bg-gray-500/20"
              value={customRating}
              onChange={(e) => setCustomRating(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={saveClickHandler}
          className="w-32 h-10 rounded-lg border-2 bg-gameView hover:bg-gray-500/20"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default MetaData

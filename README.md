# Lookout AI: Real-time Object and Person Detection
Lookout AI is a browser application designed to enhance security and monitoring through real-time object and person detection. It uses the webcam to identify and highlight objects and people within its field of vision.

## Features
- Real-time Detection: Utilizes TensorFlow's COCO-SSD model for efficient and accurate object detection.
- Interactive UI: Features a sidebar with controls for light/dark mode, auto record functionality, and the ability to take screenshots.
- Dynamic Recording: Offers both manual and automatic recording options, saving footage directly to the camera roll for easy access.
- Customizable Settings: Users can toggle mirror mode, adjust volume, and manage recording settings through an intuitive interface.

<img width="825" alt="Screenshot 2024-02-12 000557" src="https://github.com/butlerem/lookout-ai/assets/130527417/d3eb6b2d-315b-49e0-ad48-84b536c33102">

## Technologies Used
- Next.JS
- React
- TensorFlow.js & COCO-SSD: For real-time object detection and classification directly in the browser.
- Webcam Integration
- Custom UI Components
- State Management: Uses React's useState and useEffect hooks for state management and component lifecycle handling.
- Media Capture and Streams API

## Potential Applications
- Home Security: Enhance your home's security by integrating Lookout AI as a smart door camera that alerts you to visitors and potential intruders.
- Office Surveillance: Monitor office spaces for unauthorized access or activity during off-hours.
- Pet or Baby Monitoring: Keep an eye on pets or babies in different rooms without the need for specialized equipment.
- Accessibility Tools: Assist individuals with visual impairments by identifying and describing objects within their environment.

## Deployment
(https://lookout-ai.vercel.app/)

## Getting Started
To run Lookout AI in your local environment:
Clone the repository to your local machine.
Install the necessary dependencies with npm install.
Start the application with npm start. The app will be available at localhost:3000.

## Contribution
Lookout AI is open for contributions. Please submit a pull request or open an issue to discuss your ideas.

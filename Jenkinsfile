pipeline {
    agent any

    environment {
        IMAGE_NAME = "phase-ten-scorer"
        CONTAINER_NAME = "phase-ten-scorer"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

    
        stage('Build React App') {
            agent {
                docker {
                    image 'node:22-alpine' 
                    reuseNode true         
                }
            }
            steps {
       
                sh '''
                echo "--- Node Environment ---"
                node -v
                npm -v
                
                echo "--- Installing Dependencies ---"
                npm install
                
                echo "--- Building App ---"
                npm run build
                '''
            }
        }

        // Back on the Jenkins host. It will see the 'dist'/'build' folder created by the step above.
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true

                docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p 3001:80 \
                    ${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful! Phase Ten Scorer is live.'
        }
        failure {
            echo 'Deployment Failed! Check the logs above.'
        }
    }
}
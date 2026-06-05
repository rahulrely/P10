pipeline {
    agent any

    environment {
        IMAGE_NAME = "phase-ten-scorer"
        CONTAINER_NAME = "phase-ten-scorer"
        NEXUS_REGISTRY = "10.0.0.4:8083" 
        NEXUS_CREDENTIALS_ID = "nexus-login"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // 1. SONARQUBE QUALITY GATE
       stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar') {
                    sh '''
                    docker run --rm \
                        -v "${WORKSPACE}:/usr/src" \
                        -e SONAR_HOST_URL="${SONAR_HOST_URL}" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=phase-ten-scorer \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=node_modules/**,dist/** \
                        -Dsonar.login="${SONAR_AUTH_TOKEN}"
                    '''
                }
            }
        }

        // 2. BUILD REACT APP
        stage('Build React App') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                npm install
                npm run build
                '''
            }
        }

        // 3. BUILD DOCKER IMAGE
        stage('Build Docker Image') {
            steps {
                // Tag the image specifically for your Nexus registry
                sh 'docker build -t ${NEXUS_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} .'
                sh 'docker tag ${NEXUS_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest'
            }
        }

        // 4. PUSH TO NEXUS (ARTIFACT REPOSITORY)
        stage('Push to Nexus') {
            steps {
                script {
                    // Logs into Nexus using stored Jenkins credentials
                    docker.withRegistry("http://${NEXUS_REGISTRY}", "${NEXUS_CREDENTIALS_ID}") {
                        sh 'docker push ${NEXUS_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}'
                        sh 'docker push ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest'
                    }
                }
            }
        }

        // 5. DEPLOY CONTAINER
        stage('Deploy Container') {
            steps {
                sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true

                docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p 3001:80 \
                    ${NEXUS_REGISTRY}/${IMAGE_NAME}:latest
                '''
            }
        }
    }

    post {
        always {
            // Clean up old Docker images to save disk space on your VM
            sh 'docker image prune -f'
        }
        success {
            echo 'Deployment Successful! Phase Ten Scorer is live.'
        }
        failure {
            echo 'Deployment Failed! Check the logs.'
        }
    }
}
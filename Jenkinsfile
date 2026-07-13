pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'qa', 'prod'],
            description: 'Target environment for this build'
        )
    }

    environment {
        IMAGE_NAME = 'node-devops-demo'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Checks') {
            parallel {
                stage('Lint') {
                    steps {
                        echo "Running lint checks..."
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy') {
            when {
                expression { return params.ENVIRONMENT == 'prod' }
            }
            steps {
                sh '''
                    docker stop node-app || true
                    docker rm node-app || true
                    docker run -d -p 3000:3000 --name node-app ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
                echo "Deployed ${IMAGE_NAME}:${BUILD_NUMBER} to production"
            }
        }
    }

    post {
        success {
            echo "Build ${BUILD_NUMBER} succeeded for environment: ${params.ENVIRONMENT}"
        }
        failure {
            echo "Build ${BUILD_NUMBER} failed — check logs above"
        }
        always {
            echo "Pipeline finished"
        }
    }
}        
 

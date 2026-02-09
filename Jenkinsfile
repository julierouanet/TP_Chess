pipeline {
    agent { docker {
        image 'mcr.microsoft.com/playwright:v1.58.2-noble'
        args '--network=host'
    } }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }
        stage('UI Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }
    }
}

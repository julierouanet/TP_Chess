pipeline {
    agent none
    stages {
        stage('Build') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Unit Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: true,
                        reportDir: 'html',
                        reportFiles: 'index.html',
                        reportName: 'VitestReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('UI Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-noble'
                    args '--network=host'
                }
            }
            steps {
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '',
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PlaywrightReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                    ])
                }
            }
        }
        stage('docker') {
            agent any
            when { branch 'main' }
            environment {
                CI_REGISTRY = 'ghcr.io'
                CI_REGISTRY_USER = 'julierouanet'
                CI_REGISTRY_IMAGE = "${CI_REGISTRY}/${CI_REGISTRY_USER}/tp_chess"
                CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
            }
            steps {
                sh 'docker build --network=host -t $CI_REGISTRY_IMAGE .'
                sh 'echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY'
                sh 'docker push $CI_REGISTRY_IMAGE'
            }
        }
        stage('Deploy') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.58.2-noble'
                    args '--network=host'
                }
            }
            environment {
                NETLIFY_AUTH_TOKEN = credentials('NETLIFY_TOKEN')
            }
            when {
                branch 'main'
            }
            steps {
                sh 'node node_modules/netlify-cli/bin/run.js deploy --prod --site chessprojet.netlify.app --dir dist'
            }
        }
    }
}

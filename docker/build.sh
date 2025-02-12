# Execute the following commands from the project.root.directory (../)

# Builds srdc/passport-web:latest image for production deployment
docker build -f docker/Dockerfile --build-arg BUILD_ENV=prod --build-arg BASE_HREF=/ai4hf/passport/ -t srdc/passport-web:latest .

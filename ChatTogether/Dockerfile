# Set the base image
FROM nginx:alpine

# Copy the HTML and Javascript files into the default nginx public folder
COPY index.html /usr/share/nginx/html/
COPY hello.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx and keep it from running background
CMD [ "nginx", "-g", "daemon off;" ]
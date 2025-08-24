# syntax=docker/dockerfile:1
FROM ubuntu:latest AS os_config

SHELL ["/bin/bash", "-l", "-c"]

# Be sure to install the proper version of asdf
# Available version type for each tag:
# linux-arm64
# linux-386
# linux-amd64
# darwin-amd64
# darwin-arm64
ARG PACKAGE_VERSION="linux-arm64"

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl \
  git \
  jq \
  tar \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /root
RUN tag=$(curl --silent "https://api.github.com/repos/asdf-vm/asdf/tags" | jq -r '.[0].name') \
    && curl -L https://github.com/asdf-vm/asdf/releases/download/$tag/asdf-$tag-${PACKAGE_VERSION}.tar.gz --output asdf-arm64.tar.gz \
    && tar -xzf asdf-arm64.tar.gz \
    && rm -rf asdf-arm64.tar.gz

RUN mv asdf /usr/local/bin && chmod +x /usr/local/bin/asdf
ENV PATH="/usr/local/bin:/root/.asdf/shims:${PATH}"

COPY .tool-versions /root/.tool-versions
RUN for tool in $(awk '{print $1}' < .tool-versions); do \
      if ! asdf plugin list | grep -q "^$tool\$"; then \
        asdf plugin add $tool; \
      fi; \
    done && \
    asdf install && \
    asdf reshim

# Install dependencies
FROM os_config AS dependencies_installation
WORKDIR /root/app
COPY pnpm-lock.yaml package.json /root/app
RUN pnpm i --frozen-lockfile

# Building image
FROM os_config AS application_building
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /root/app
COPY --from=dependencies_installation /root/app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production image, copy all the files and run next
FROM os_config AS application_run
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /root/app

# We do not have any public resources, so comment this line for now
# COPY --from=application_building /root/app/public ./public
COPY --from=application_building /root/app/.next/standalone ./
COPY --from=application_building /root/app/.next/static ./.next/static
COPY --from=application_building /root/app/entrypoint.sh ./docker/entrypoint.sh

ENV PORT=3000
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
RUN chmod 755 ./docker/entrypoint.sh
ENTRYPOINT [ "./docker/entrypoint.sh" ]

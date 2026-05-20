FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 10000
ENV ASPNETCORE_URLS=http://+:10000

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["FinCoreLanding.csproj", "."]
RUN dotnet restore "./FinCoreLanding.csproj"
COPY . .
RUN dotnet build "FinCoreLanding.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FinCoreLanding.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FinCoreLanding.dll"]
